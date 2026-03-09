import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'apps', 'api'))
from index import app
from mangum import Mangum

handler = Mangum(app)