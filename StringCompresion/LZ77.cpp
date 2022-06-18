#include <string>
#include <cmath>
#include <algorithm>
#include <tuple>
#include <iostream>
using namespace std;

string next_bin(string bin)
{
    int k = bin.size() - 1;
    while(bin[k] == '1')
    {
        bin[k] = '0';
        k--;
    }
    if(k == -1)
        bin = "1" + bin;
    else
        bin[k] = '1';
    return bin;
}

int bin_to_dec(string bin)
{
    int dec = 0;
    int n = bin.size();
    int k = 1;
    for(int i = 0; i < n; i++)
    {
        if(bin[n-1-i] == '1')
            dec += k;
        k *= 2;
    }
    return dec;
}

// if nb_bits > 1, add 0s at the beginning of the output string so that its size is nb_bits
string dec_to_bin(int dec, int nb_bits=-1)
{
    string bin;
    while(dec != 0)
    {
        if(dec % 2 == 0)
        {
            bin = "0" + bin;
            dec /= 2;
        }
        else
        {
            bin = "1" + bin;
            dec = (dec - 1) / 2;
        }
    }

    if(nb_bits > 0 && bin.size() < nb_bits)
    {
        string fill(nb_bits - bin.size(), '0');
        return fill + bin;
    }
    return bin;
}

/**
returns a pair (p, n) where p is the position of the first character of the match relatively to the end of dictionary (p = 0 means no match)
    and n is the length of the match
the match is the longest substring of dictionary + lookahead_buffer which is a prefix of lookahead_buffer (where + represents string concatenation)
*/
pair<int, int> get_longest_match(const string& dictionary, const string& lookahead_buffer)
{
    int p = 0; // q = dictionary.size() - p
    int n = 0;

    int dict_size = dictionary.size();
    int buffer_size = lookahead_buffer.size();

    for(int q = 0; q < dictionary.size(); q++)
    {
        int local_n = 0;
        while(local_n < min(buffer_size, dict_size - q) && dictionary[q + local_n] == lookahead_buffer[local_n])
            local_n++;
        if(local_n == dict_size - q) // the match may continue in the buffer
        {
            int buffer_index = 0;
            while(local_n < buffer_size && lookahead_buffer[buffer_index] == lookahead_buffer[local_n])
            {
                buffer_index++;
                local_n++;
            }
        }
        if(local_n > n)
        {
            n = local_n;
            p = dict_size - q;
        }
    }

    //cout << n << " ";
    return make_pair(p, n);
}

/**
0: char on 8 bits
1: tuple (p, n) on 15 + 8 bits (only if n >= 3, otherwise send chars)
    note: p is shifted 1 down and n is shifted 3 down
*/
string lz77_Compressor(const string& input)
{
    size_t cursor = 0;
    size_t input_size = input.size();

    int dictionary_size = pow(2, 15); // (2^15 - 1) + 1 because p >= 1 if there is a match
    int buffer_size = pow(2, 8) + 2; // (2^8 - 1) + 3 because n >= 3

    string output, output_bin;
    size_t output_bin_cursor = 0;

    while(cursor < input_size)
    {
        // if cursor < dictionary_size then substr(0, cursor) else substr(cursor - dictionary_size, dictionary_size)
        string dictionary = input.substr(std::max(0, (int)cursor - dictionary_size), std::min(cursor, (size_t)dictionary_size)); // PB
        string buffer = input.substr(cursor, buffer_size);

        pair<int, int> x = get_longest_match(dictionary, buffer);

        int p = x.first; // in {1, ..., 2^15}, will be shifted to {0, ..., 2^15 - 1} ; 2^15 = 32768
        int n = x.second; // in {3, ..., 2^8 + 2}, will be shited to {0, ..., 2^8 - 1} ; 2^8 = 256
        if(n < 3)
        {
            output_bin += "0";
            output_bin += dec_to_bin((int)(unsigned char)input[cursor], 8);
            cursor++;
        }
        else
        {
            output_bin += "1";
            output_bin += dec_to_bin(p - 1, 15);
            output_bin += dec_to_bin(n - 3, 8);
            cursor += n;
        }

        int output_bin_size = output_bin.size();
        while(output_bin_size - output_bin_cursor >= 8)
        {
            string c = output_bin.substr(output_bin_cursor, 8);
            output += (char)bin_to_dec(c);
            output_bin_cursor += 8;
        }

        if(output_bin_size > output_bin.max_size() - 100)
        {
            output_bin.erase(0, cursor);
            output_bin_cursor = 0;
        }
    }

    // fill last byte with 0 (minimal size to encode a something is 9 anyway)
    output_bin.erase(0, output_bin_cursor);
    if(!output_bin.empty())
    {
        string fill_byte(8 - output_bin.size(), '0');
        output_bin += fill_byte;
        string c = output_bin.substr(0, 8);
        output += (char)bin_to_dec(c);
    }

    return output;
}

string lz77_Descompressor(const string& input)
{
    size_t input_size = input.size();
    size_t input_cursor = 0;

    string input_bin;
    size_t input_bin_cursor = 0;

    // initial input_bin fill
    while(input_cursor < input_size && input_bin.size() < input_bin.max_size() - 100)
    {
        input_bin += dec_to_bin((int)(unsigned char)input[input_cursor], 8);
        input_cursor++;
    }

    string output;

    while(!input_bin.empty())
    {
        char type = input_bin[input_bin_cursor];
        input_bin_cursor++;

        if(input_bin_cursor > input_bin.size() || input_bin.size() - (int)input_bin_cursor < 8) // only last byte filling bits remain
            return output;

        if(type == '0')
        {
            std::string c = input_bin.substr(input_bin_cursor, 8);
            output += (char)bin_to_dec(c);
            input_bin_cursor += 8;
        }
        else
        {
            int p = bin_to_dec(input_bin.substr(input_bin_cursor, 15)) + 1;
            input_bin_cursor += 15;
            int n = bin_to_dec(input_bin.substr(input_bin_cursor, 8)) + 3;
            input_bin_cursor += 8;

            size_t match_begin = output.size() - p; // not just substr because of the eventual overlap
            for(int k = 0; k < n; k++)
                output += output[match_begin + k];
        }

        // refill input_bin
        if(input_bin.size() - (int)input_bin_cursor < 100 && input_cursor < input_size)
        {
            input_bin.erase(0, input_bin_cursor);
            input_bin_cursor = 0;

            while(input_cursor < input_size && input_bin.size() < input_bin.max_size() - 100)
            {
                input_bin += dec_to_bin((int)(unsigned char)input[input_cursor], 8);
                input_cursor++;
            }
        }
    }

    return output;
}



