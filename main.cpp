#include "Compesion algorithms/huffman.h"
#include "Compesion algorithms/huffman.cpp"
#include "Compesion algorithms/LZ77.h"
#include "Compesion algorithms/LZ77.cpp"

#include <fstream>

int main(int argc, char *argv[]) {

    std::string Path1 = "/home/ims/Documentos/GitHub/AyEDII-Proyecto-III/preCompress/JJK.txt";
    std::string Path2 = "/home/ims/Documentos/GitHub/AyEDII-Proyecto-III/Compress/JJK.hffmn";
    std::string Path3 = "/home/ims/Documentos/GitHub/AyEDII-Proyecto-III/descompress/JJK.txt";


    
    char* PorComprimir = const_cast<char *>(Path1.c_str());
    char* Comprimido = const_cast<char *>(Path2.c_str());
    char* Descomprimido = const_cast<char *>(Path3.c_str());


    cout << "comprimiendo" << endl;
    map<unsigned char, string> codes;
    compressFile(PorComprimir, Comprimido, codes);



    decompressFile(Comprimido, Descomprimido);
    

    std::string Pathz1 = "/home/ims/Documentos/GitHub/AyEDII-Proyecto-III/preCompress/JJK.txt";
    std::string Pathz2 = "/home/ims/Documentos/GitHub/AyEDII-Proyecto-III/Compress/JJK.lz77";
    std::string Pathz3 = "/home/ims/Documentos/GitHub/AyEDII-Proyecto-III/descompress/JJK.txt";

    LZ77 *lz77 = new LZ77();
    cout << "Inicio de compresión LZ77" << endl;
    lz77->compress_file(Pathz1, Pathz2);
    cout << "Finalización de compresión LZ77" << endl;
    cout << "Inicio de descompresión LZ77" << endl;
    lz77->decompress_file(Path2, Path3);
    cout << "Finalización de descompresión LZ77" << endl;

    return 0;
}