import os, json
from flask import Flask
from cfenv import AppEnv
from hdbcli import dbapi



app = Flask(__name__)		
env = AppEnv()		


port = int(os.getenv('PORT', 9099))

hana = env.get_service(name='navin-test')	

@app.route('/hana')
def hello():
    conn = dbapi.connect(address=hana.credentials['host'],
                         port= int(hana.credentials['port']),
                         user = hana.credentials['user'],
                         password = hana.credentials['password'],
                         CURRENTSCHEMA=hana.credentials['schema'])
    
    # check if database connection has been established successfully
    # and output to application logs
    if conn.isconnected():
        print('Connection to database successful')      
    else:
        print('Unable to connect to database')
    po_list=[]
    cursor = conn.cursor()
    cursor.execute("select * from \"A2F008990B284A638D1DCEAB5D55455B\".\"TEST\";", {})
    records= cursor.fetchall()

    cursor.close()
    conn.close()


    return json.dumps(serializeListToDict(records, ["id", "name"]))

def serializeListToDict(data, keys):
    output=[]
    for d in data:
      output.append({keys[i]:j for i,j in enumerate(d)})
    return output

if __name__ == '__main__':
    # Run the app, listening on all IPs with our chosen port number
    app.run(host='0.0.0.0', port=port)