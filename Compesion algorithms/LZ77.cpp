#include "LZ77.h"
#include <fstream>

void LZ77::compress_file(string file_in, string file_out) {
    //Prepare input and output streams
    ifstream fs_in(file_in, ifstream::binary);
    ofstream fs_out(file_out, ofstream::binary);

    //Prepare flag - is the end of input file reached
    bool input_file_end_reached = false;

    //Read the first chunk of file and fill the dictionary
    if (read_input_file(fs_in, BUFFER_SIZE_LOOK_AHEAD)) input_file_end_reached = true;

    for (uint32_t i = 0; i < BUFFER_SIZE_DICTIONARY; i++) {
        buffer[i] = buffer[BUFFER_SIZE_DICTIONARY];
    }

    //Write triple - (distance, length, next_byte)
    //First triple is always (0, 0, buffer[read_pointer])
    write_triple(fs_out, 0, 0, buffer[read_pointer++]);

    //Read next byte
    if (!input_file_end_reached) if (read_input_file(fs_in, 1)) input_file_end_reached = true;

    while (write_pointer != read_pointer) {
        //Find the longest match
        uint32_t best_match_position = 0;
        uint32_t best_match_length = 0;
        uint32_t current_match_position = 0;
        uint32_t current_match_length = 0;

        for (uint32_t i = 0; i < BUFFER_SIZE_DICTIONARY; i++) {
            if (read_buffer_dictionary(i) == read_buffer_look_ahead(current_match_length)) {
                if (current_match_length == 0) current_match_position = i;
                current_match_length++;
            } else {
                if (current_match_length > best_match_length) {
                    best_match_position = current_match_position;
                    best_match_length = current_match_length;
                }
                current_match_position = 0;
                current_match_length = 0;
            }

            //Handling the end of look_ahead buffer
            if (current_match_length == buffer_bytes_available()) {
                best_match_position = current_match_position;
                best_match_length = current_match_length - 1;

                break;
            }
        }

        //Read next bytes
        if (!input_file_end_reached) if (read_input_file(fs_in, best_match_length)) input_file_end_reached = true;

        //Move read_pointer to new position
        read_pointer += best_match_length;
        read_pointer -= (read_pointer >= BUFFER_SIZE) * BUFFER_SIZE;

        //If match found
        if (best_match_length) {
            //Write triple - (distance, length, next_byte)
            write_triple(fs_out, BUFFER_SIZE_DICTIONARY - best_match_position, best_match_length, buffer[read_pointer]);
        } else {
            //Write triple - (distance, length, next_byte)
            //(0, 0, next_byte)
            write_triple(fs_out, 0, 0, buffer[read_pointer]);
        }

        //Read next byte
        if (!input_file_end_reached) if (read_input_file(fs_in, 1)) input_file_end_reached = true;

        //Move read_pointer to new position
        read_pointer++;
        read_pointer -= (read_pointer >= BUFFER_SIZE) * BUFFER_SIZE;
    }

    //Close files
    fs_in.close();
    fs_out.close();
}

void LZ77::decompress_file(string file_in, string file_out) {
    //Prepare input and output streams
    ifstream fs_in(file_in, ifstream::binary);
    ofstream fs_out(file_out, ofstream::binary);

    //Prepare buffer for reading triples
    char *triple_buffer = new char[4];

    //Prepare triple variables
    uint16_t distance = 0;
    uint8_t length = 0;
    uint8_t next_byte = 0;

    //Read first triple
    if (read_triple(fs_in, triple_buffer, &distance, &length, &next_byte)) {
        //If read failed

        //Delete buffer for reading triples
        delete[] triple_buffer;

        //Close files
        fs_in.close();
        fs_out.close();

        return;
    }

    //First triple - (0, 0, next_byte)
    //Write first byte to output file
    fs_out << next_byte;

    //Fill buffer
    for (uint32_t i = 0; i < BUFFER_SIZE_DICTIONARY; i++) {
        buffer[i] = next_byte;
    }
    write_pointer = BUFFER_SIZE_DICTIONARY;

    while (true) {
        //Read triple
        if (read_triple(fs_in, triple_buffer, &distance, &length, &next_byte)) break;

        //Decode triple
        if (distance == 0 && length == 0) {
            fs_out << next_byte;

            buffer[write_pointer++] = next_byte;
            write_pointer -= (write_pointer >= BUFFER_SIZE) * BUFFER_SIZE;
        } else {
            read_pointer = (write_pointer + BUFFER_SIZE - distance) -
                           ((write_pointer + BUFFER_SIZE - distance) >= BUFFER_SIZE) * BUFFER_SIZE;

            for (uint32_t i = 0; i < length; i++) {
                fs_out << buffer[read_pointer];

                buffer[write_pointer++] = buffer[read_pointer++];

                write_pointer -= (write_pointer >= BUFFER_SIZE) * BUFFER_SIZE;
                read_pointer -= (read_pointer >= BUFFER_SIZE) * BUFFER_SIZE;
            }

            fs_out << next_byte;
            buffer[write_pointer++] = next_byte;
            write_pointer -= (write_pointer >= BUFFER_SIZE) * BUFFER_SIZE;
        }
    }

    //Delete buffer for reading triples
    delete[] triple_buffer;

    //Close files
    fs_in.close();
    fs_out.close();
}

int32_t LZ77::read_input_file(ifstream &fs_in, uint32_t length) {
    //Case: reading to the middle of the buffer
    if (write_pointer + length < BUFFER_SIZE) {
        fs_in.read(buffer + write_pointer, length);

        int32_t bytes_read = fs_in.gcount();
        write_pointer += bytes_read;

        return length - bytes_read;
    }

    //Case: reading to the end of the buffer
    if (write_pointer + length == BUFFER_SIZE) {
        fs_in.read(buffer + write_pointer, length);

        int32_t bytes_read = fs_in.gcount();
        write_pointer += bytes_read;
        write_pointer -= (write_pointer >= BUFFER_SIZE) * BUFFER_SIZE;

        return length - bytes_read;
    }

    //Case: reading with crossing the end of the buffer
    {
        fs_in.read(buffer + write_pointer, BUFFER_SIZE - write_pointer);

        int32_t bytes_read = fs_in.gcount();
        write_pointer += bytes_read;
        write_pointer -= (write_pointer >= BUFFER_SIZE) * BUFFER_SIZE;

        if (write_pointer != 0) return bytes_read;

        fs_in.read(buffer, length - bytes_read);

        int32_t bytes_read_2 = fs_in.gcount();
        write_pointer += bytes_read_2;
        write_pointer -= (write_pointer >= BUFFER_SIZE) * BUFFER_SIZE;

        return length - (bytes_read + bytes_read_2);
    }
}

char LZ77::read_buffer_dictionary(uint32_t position) {
    //Safe if (read_pointer + BUFFER_SIZE_LOOK_AHEAD + position) < 2 * BUFFER_SIZE
    return buffer[(read_pointer + BUFFER_SIZE_LOOK_AHEAD + position) -
                  ((read_pointer + BUFFER_SIZE_LOOK_AHEAD + position) >= BUFFER_SIZE) * BUFFER_SIZE];
}

char LZ77::read_buffer_look_ahead(uint32_t position) {
    //Safe if (read_pointer + position) < 2 * BUFFER_SIZE
    return buffer[(read_pointer + position) - ((read_pointer + position) >= BUFFER_SIZE) * BUFFER_SIZE];
}

void LZ77::write_triple(ofstream &fs_out, uint16_t distance, uint8_t length, uint8_t next_byte) {
    fs_out << (uint8_t) ((distance >> 8) & 0xFF);
    fs_out << (uint8_t) ((distance >> 0) & 0xFF);

    fs_out << length;

    fs_out << next_byte;
}

int32_t LZ77::read_triple(ifstream &fs_in, char *buffer, uint16_t *distance, uint8_t *length, uint8_t *next_byte) {
    //Note: Minimum buffer size is 4 bytes
    fs_in.read(buffer, 4);

    *distance = (((uint16_t) buffer[0] & 0xFF) << 8);
    *distance |= (((uint16_t) buffer[1] & 0xFF) << 0);

    *length = buffer[2];

    *next_byte = buffer[3];

    return 4 - fs_in.gcount();
}

uint32_t LZ77::buffer_bytes_available() {
    //Safe if (BUFFER_SIZE + write_pointer - read_pointer) < 2 * BUFFER_SIZE
    return (BUFFER_SIZE + write_pointer - read_pointer) -
           ((BUFFER_SIZE + write_pointer - read_pointer) >= BUFFER_SIZE) * BUFFER_SIZE;
}

LZ77::LZ77() {
    buffer = new char[BUFFER_SIZE];
    write_pointer = BUFFER_SIZE_DICTIONARY;
    read_pointer = BUFFER_SIZE_DICTIONARY;
}

