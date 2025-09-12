const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json())

app.post('', (req,res) => {
    
})


app.listen(4000, () => {console.log("backend running on port 4000 ")});
