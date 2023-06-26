import axios from 'axios';
import { useEffect, useState } from 'react';

const BASE_URL = "http://127.0.0.1:5000/play/";
export const getTrivia = (theme) => {
    axios.get(BASE_URL + theme).then(({data}) => data); 
}
