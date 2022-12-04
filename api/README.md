### setup
```
cd api 
python3 -m venv venv
source venv/bin/activate 
pip3 install fastapi "uvicorn[standard]"
pip3 install python-multipart
pip3 install sqlalchemy
pip3 install scikit-learn 
pip3 install -r requirements.txt  
```

### run server
```
 uvicorn main:app --reload
```