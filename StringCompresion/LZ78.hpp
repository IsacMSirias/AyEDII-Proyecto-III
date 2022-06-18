#ifndef LZ78_H
#define LZ78_H

#include <iostream>
#include <string>
#include <iterator>
#include <vector>
#include <algorithm>
#include <sstream>

using namespace std;

class LZ78

{

public:
    LZ78(){};
    string Encode(string input);
    string Decode(string intput);
};

#endif