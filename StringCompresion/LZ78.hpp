//
// Created by jose on 8/6/22.
//

#ifndef PROYECTO3_LZ78_HPP
#define PROYECTO3_LZ78_HPP
#include "string"
#include "vector"

using namespace std;

class LZ78 {
public:
    string encode(string input);
    string decode(string input);

private:
    struct Node{
        int index;
        string data;
        Node *next;
    };
    void insertNode(Node *head, int index, string data);
    void st_Node(Node *head, int index, string data);
    Node *search_for_Node(Node *Head, int index);
    Node *search_for_Node(Node *head, string data);
    vector<string> split(string str, char delimiter);
};


#endif //PROYECTO3_LZ78_HPP
