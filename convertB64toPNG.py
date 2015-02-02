print "Start decode..."

import base64

b64 = open("C:/Program Files/PostgreSQL/EnterpriseDB-ApachePHP/apache/www/970_Mobile_Cartography/audio/intro.base64")
image = open("C:/Program Files/PostgreSQL/EnterpriseDB-ApachePHP/apache/www/970_Mobile_Cartography/audio/intro.png","wb")

imgdata = base64.b64decode(b64.read())
image.write(imgdata)

b64.close()
image.close()

print "Finished"
