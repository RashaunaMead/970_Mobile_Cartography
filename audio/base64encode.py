import base64
filename = raw_input("Enter the filename without extension: ")
sound_file = filename+".mp3"
# use mode = "rb" to read binary file
fin = open(sound_file, "rb")
binary_data = fin.read()
fin.close()
# encode binary to base64 string (printable)
b64_data = base64.b64encode(binary_data)
b64_fname = filename+".base64"
# save base64 string to given text file
fout = open(b64_fname, "w")
fout.write(b64_data)
fout.close()

