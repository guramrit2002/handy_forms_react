import './App.css';
import axios from 'axios';
import { useState, useEffect, useRef } from 'react';

function App() {
  const [formHTML, setFormHTML] = useState('');
  const [types, setTypes] = useState([]);
  const [ontypes, setOnTypes] = useState(true);
  const [selectedType, setSelectedTypes] = useState('');
  const [fieldData,setFieldData] = useState({})
  const formRef = useRef(null);
  const url_field = 'http://127.0.0.1:8000/form/get/field/';
  const url_types = 'http://127.0.0.1:8000/form/alltypes';

  // Fetch form HTML and types when the component mounts
  useEffect(() => {
    axios.get(url_types)
      .then((res) => {
        setTypes(res.data.types);
      })
      .catch((error) => {
        console.error('Error fetching types!', error);
      });

    axios.get(url_field)
      .then((res) => {
        setFormHTML(res.data.html);
      })
      .catch((error) => {
        console.error('Error fetching form data!', error);
      });
  }, []);

  // Handle form submission to print the form data
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent the default form submission
  
    // Create FormData from the form DOM element
    const formData = new FormData(formRef.current);
  
    // Convert FormData entries into an object
    const formDataObject = {};
    formData.forEach((value, key) => {
      formDataObject[key] = value;
    });
  
    // Include the selected type in the form data
    formDataObject['type'] = selectedType;
  
    // Update the state with the form data including the type
    setFieldData(formDataObject);
  
    // Print the field data to the console (optional)
    console.log('Form data including type:', formDataObject);
  };

  return (
    <div className="container">
      <div className='form-preview'>
      </div>
      <div className="fields-section">
        <div className="all-types">
          {ontypes ? (
            types.map((type) => (
              <div
                className="type-single"
                key={type}
                onClick={() => {
                  setOnTypes(false);
                  setSelectedTypes(type);
                  setFieldData({})
                }}
              >
                {type}
              </div>
            ))
          ) : (
            <div>
              <form
                method="post"
                style={{ width: '100%' }}
                ref={formRef}
                onSubmit={handleSubmit}
                dangerouslySetInnerHTML={{ __html: formHTML }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
