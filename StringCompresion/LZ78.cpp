#include "LZ78.hpp"

using namespace std;

struct Node{
	int index;
	string data;
	Node *next;
};

vector<string> split(string input, char delimiter)
{
    vector<string> tokens;
    string token;
    stringstream stream(input);

    while (getline(stream, token, delimiter))
    {
        tokens.push_back(token);
    }

    return tokens;
}

void setNode(Node *head, int index, string data){
	head->index = index;
	head->data = data;
	head->next = NULL;
}

void insertNode(Node *head, int index, string data){
	Node *new_Node = new Node;
	new_Node->index = index;
	new_Node->data = data;
	new_Node->next = NULL;

	Node *current = head;
	while (current != NULL)
	{
		if (current->next == NULL)
		{
			current->next = new_Node;
			return;
		}
		current = current->next;
	}
}

Node *getNode(Node *head, string data)
{
	Node *current = head;
	while (current != NULL)
	{
		if (data.compare(current->data) == 0)
			return current;
		else
			current = current->next;
	}
	return NULL;
}

Node *getNode(Node *head, int index)
{
	Node *current = head;
	while (current != NULL)
	{
		if (index == current->index)
			return current;
		else
			current = current->next;
	}
	return NULL;
}

bool deleteNode(Node *head, Node *to_delete){
	if (to_delete == NULL)
		return false;
	else if (to_delete == head)
	{
		head = to_delete->next;
		delete to_delete;
		return true;
	}
	else{
		Node *current = head;
		while (current)
		{
			if (current->next == to_delete)
			{
				current->next = to_delete->next;
				delete to_delete;
				return true;
			}
			current = current->next;
		}
		return false;
	}
}



string LZ78::Encode(string input)
{
    Node *dictionary = new Node;
    string word, result;
    int length, last_seen, index = 1;

    length = (int)input.length();
    word = input[0];
    setNode(dictionary, 1, word);
    result += "0," + word;

    for (int i = 1; i < length; i++)
    {
        string data;
        data = input[i];

    re_check:
    
        Node *search = getNode(dictionary, data);

        if (search)
        {
            i++;
            data += input[i];
            last_seen = search->index;
            goto re_check;
        }
        else
        {
            char zero;
            if (input[i] == ' ')
                zero = '0';
            else
                zero = input[i];

            if ((int)data.length() < 2)
                result += " " + to_string(0) + "," + zero;
            else
                result += " " + to_string(last_seen) + "," + zero;

            index++;
            if (i != length)
                insertNode(dictionary, index, data);
        }
    }

    return result;
}

string LZ78::Decode(string input)
{
    Node *dictionary = new Node;
    string result;

    vector <string> s_input = split(input, ' ');
    int zz = 2;
    for (int i = 0; i < s_input.size(); i++)
    {
        vector <string> ss_input = split(s_input[i], ',');

        if (i == 0)
        {
            setNode(dictionary, 1, ss_input[1]);
            result += ss_input[1];
        }
        else
        {
            Node *searched;
            string get_search = ss_input[1];
            searched = getNode(dictionary, stoi(ss_input[0]));
            
            if (searched)
            {
                result += searched->data + get_search;
                get_search = searched->data + split(s_input[i], ',')[1];
                insertNode(dictionary, zz, get_search);
            }
            else
            {
                if (stoi(ss_input[0]) == 0)
                    insertNode(dictionary, zz, get_search);
                else
                    insertNode(dictionary, zz, get_search);

                result += get_search;
            }
            zz++;
        }
    }

    if (result[(int)result.length() - 1] == '0')
        result = result.substr(0, result.size() - 1);
    
    return result;
}