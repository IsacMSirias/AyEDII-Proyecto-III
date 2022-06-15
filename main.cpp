#include "Compesion algorithms/huffman.h"
#include "Compesion algorithms/huffman.cpp"

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


   // cout << "Descomprimiendo" << endl;
    decompressFile(Comprimido, Descomprimido);
    //cout << "terminado" << endl;
    return 0;
}