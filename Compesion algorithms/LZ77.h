#ifndef LZ77_H
#define LZ77_H

#include <cstdint>
#include <string>

using namespace std;

class LZ77 {
public:

    void compress_file(string file_in, string file_out);

    void decompress_file(string file_in, string file_out);

    LZ77();


private:

    char *buffer;
    uint32_t write_pointer;
    uint32_t read_pointer;

    const uint32_t BUFFER_SIZE_DICTIONARY = 65535;
    const uint32_t BUFFER_SIZE_LOOK_AHEAD = 256;
    const uint32_t BUFFER_SIZE = (BUFFER_SIZE_DICTIONARY + BUFFER_SIZE_LOOK_AHEAD);

    int32_t read_input_file(ifstream &fs_in, uint32_t length);

    char read_buffer_dictionary(uint32_t position);

    char read_buffer_look_ahead(uint32_t position);

    void write_triple(ofstream &fs_out, uint16_t distance, uint8_t length, uint8_t next_byte);

    int32_t read_triple(ifstream &fs_in, char *buffer, uint16_t *distance, uint8_t *length, uint8_t *next_byte);

    uint32_t buffer_bytes_available();
};

#endif 