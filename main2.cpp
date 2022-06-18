#include <string>
#include <iostream>
using namespace std;

#include"StringCompresion/LZ77.cpp"
#include "StringCompresion/LZ78.hpp"
#include "StringCompresion/LZ78.cpp"
#include "StringCompresion/huffman.cpp"

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


  /* LZ78 *lz78 = new LZ78();

    string test;
    test = "El bullying o acoso escolar, si hace falta definirlo, es una conducta sostenida e implacable de agresión hacia un individuo o un pequeño conjunto de ellos, que ocurre en el ámbito de la escuela";

    string encode = lz78->encode(test);

    //cout<< encode <<endl;

    string descompression = lz78->decode(encode);

    cout<< descompression <<endl;
*/

    string test = "El bullying o acoso escolar, si hace falta definirlo, es una conducta sostenida e implacable de agresión hacia un individuo o un pequeño conjunto de ellos, que ocurre en el ámbito de la escuela";
    string encodedString, decodedString; 


    calcFreq(test, test.length()); 
    HuffmanCodes(test.length()); 

    for (auto i: test) 
        encodedString+=codes[i]; 
  
    cout << "\nEncoded Huffman data:\n" << encodedString << endl; 
  
    decodedString = decode_file(minHeap.top(), encodedString); 
    
    cout << "\nDecoded Huffman Data:\n" << decodedString << endl; 

    return 0;
}