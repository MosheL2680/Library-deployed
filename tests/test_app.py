# This file test the app

import unittest

from my_project import app

class FlaskTest(unittest.TestCase):
    
    # check for response 200
    def test_index(self):
        tester = app.test_client(self)
        response = tester.get("/")
        status_code = response.status_code
        self.assertEqual(status_code, 200)
        

if __name__ == "__main__":
    unittest.main()