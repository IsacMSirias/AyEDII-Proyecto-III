
{
  "targets": [
    {
      "target_name": "compresslz77",
      "sources": [ "src/compressLZ77.cpp" ],
      "include_dirs": ["<!(node -e \"require('nan')\")"]
    },
    {
      "target_name": "decompresslz77",
      "sources": [ "src/decompressLZ77.cpp" ],
      "include_dirs": ["<!(node -e \"require('nan')\")"]
    },
    {
      "target_name": "compresslz78",
      "sources": [ "src/compressLZ78.cpp" ],
      "include_dirs": ["<!(node -e \"require('nan')\")"]
    },
    {
      "target_name": "decompresslz78",
      "sources": [ "src/decompressLZ78.cpp" ],
      "include_dirs": ["<!(node -e \"require('nan')\")"]
    }
  ]
}