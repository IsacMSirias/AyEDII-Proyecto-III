#include <string>
#include <iostream>
using namespace std;

#include"StringCompresion/LZ77.cpp"
#include "StringCompresion/LZ78.hpp"
#include "StringCompresion/LZ78.cpp"

int main () {
    
   /* string test;
    test = "El bullying o acoso escolar, si hace falta definirlo, es una conducta sostenida e implacable de agresión hacia un individuo o un pequeño conjunto de ellos, que ocurre en el ámbito de la escuela";

    string descompressed;
    string compressed; 
    compressed = lz77_Compressor(test);
    descompressed = lz77_Descompressor(compressed);

    cout<< compressed <<endl;
    //cout<< descompressed << endl;
    */


   LZ78 *lz78 = new LZ78();

    string test;
    test = "El bullying o acoso escolar, si hace falta definirlo, es una conducta sostenida e implacable de agresión hacia un individuo o un pequeño conjunto de ellos, que ocurre en el ámbito de la escuela";

    string encode = lz78->Encode(test);

    cout<< encode <<endl;

    return 0;
}