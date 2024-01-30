
import store from '@/store/index.js'; 
import axios from "axios";

export const apiLabo = axios.create({
	baseURL: 'https://laboratorio3-f36a.restdb.io/rest',
	withCredentials : false,
	
	headers: {'x-apikey': '60eb09146661365596af552f',
	Accept: 'application/json',
	},
	
});
export default{
	
	transaction(purchaseData){
		return apiLabo.post(`/transactions`, purchaseData)
	},
	getHistorial(){
		return apiLabo.get(`/transactions?q={"user_id": "${store.state.id}"}`)
	},
	delete(id){
		return apiLabo.delete(`/transactions/${id}`)
	},
	edit(id,editar){
		return apiLabo.patch(`/transactions/${id}`, editar)
	}

}
