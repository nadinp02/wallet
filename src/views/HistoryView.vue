<template>
  <div>
    <navbar></navbar>

    <div v-if="loading" class="d-flex justify-content-center mt-5">
      <div class="spinner-border spinner-border-sm mt-1 me-2" role="status"></div>
      <h5>Loading...</h5>
    </div>

    <div v-else>
      <div class="container">
        <table v-if="state.historial != null" class="table table-striped">
          <thead>
            <tr>
              <th scope="col">Coin</th>
              <th scope="col">Amount</th>
              <th scope="col">Money</th>
              <th scope="col">Date</th>
              <th scope="col">Movement</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>

            <tbody>
                <tr v-for="(item, index) in state.historial.slice().reverse()" :key="index">
                    <th scope="row">{{ item.crypto_code.toUpperCase() }}</th>
                    <td>{{ item.crypto_amount }}</td>
                    <td>${{ item.money }}</td>
                    <td>{{ item.datetime.slice(0, 10) }}</td>
                    <td>
                        <b>{{ item.action.toUpperCase() }}</b>
                    </td>
                    <td>
                        <button type="button" class="btn btn-danger me-1" :data-bs-target="'#exampleModal-' + index" data-bs-toggle="modal">Delete</button>
                        
                        <div class="modal fade" :id="'exampleModal-' + index" tabindex="-1" role="dialog" :aria-labelledby="'exampleModalLabel-' + index" aria-hidden="true">
                        <div class="modal-dialog" role="document">
                            <div class="modal-content">
                            <div class="modal-header">
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <h3><b>Are you sure?</b></h3>
                            </div>
                            <div class="modal-footer mx-5">
                                <button type="button"  class="btn btn-danger" data-bs-dismiss="modal">Cancel</button>
                                <button type="button" class="btn btn-success" data-bs-dismiss="modal" @click="deleteTransaction(item._id)" >Confirm</button>
                            </div>
                            </div>
                        </div>
                        </div>

                        <button type="button" class="btn btn-primary" :data-bs-target="'#editModal-' + index" data-bs-toggle="modal" >Edit </button>
                        
                        <div class="modal fade" :id="'editModal-' + index" tabindex="-1" aria-labelledby="'exampleModalLabel-' + index" aria-hidden="true" >
                        <div class="modal-dialog">
                            <div class="modal-content">
                            <div class="modal-header">
                                <h3 class="modal-title" id="'exampleModalLabel-' + index">
                                Purchase Details
                                </h3>
                                
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <div class="modal-body">
                                   
                                    <div class="form-group d-flex align-items-center justify-content-between">
                                      <label :for="'editCode-' + index">Coin:</label>
                                      <input v-model="item.crypto_code" type="text" class="form-control" :id="'editCode-' + index"/>
                                    </div>
                                     <div class="form-group d-flex align-items-center justify-content-between">
                                    <label :for="'editAction-' + index">Action:</label>
                                    <select v-model="item.action" class="form-select" :id="'editAction-' + index">
                                      <option value="purchase">Purchase</option>
                                      <option value="sale">Sale</option>
                                    </select>
                                  </div>
                                    <div class="form-group d-flex align-items-center justify-content-between">
                                      <label :for="'editAmount-' + index">Amount:</label>
                                      <input v-model="item.crypto_amount" type="number" min="0" class="form-control" :id="'editAmount-' + index"/>
                                    </div>
                                    
                                    <div class="form-group d-flex align-items-center justify-content-between">
                                      <label :for="'editDate-' + index">Date:</label>
                                      <input v-model="item.datetime" type="text" class="form-control" :id="'editDate-' + index"/>
                                    </div>

                                    <div class="form-group d-flex align-items-center justify-content-between">
                                    <label :for="'editPrice-' + index">Money:</label>
                                    <input v-model="item.money" type="number" min="0" class="form-control" :id="'editPrice-' + index"/>
                                    </div>
                                </div>

                                <div class="modal-footer mx-5">
                                    <button type="button" class="btn btn-danger" data-bs-dismiss="modal"> Cancel </button>
                                    <button type="button" class="btn btn-success" data-bs-dismiss="modal" @click="editTransaction(item._id, item.crypto_amount, item.money)">Confirm</button>
                                </div>
                            </div>

                            </div>
                        </div>
                        </div>
                    </td>
                </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import laboApi from "@/services/labo";
import navbar from "@/components/NavBar.vue";
import { onMounted, reactive, ref } from "vue";

export default {
  components: {
    navbar,
  },

  setup() {
    const state = reactive({
      historial: null,
    });

    const loading = ref(false);

    const Historial = async () => {
      loading.value = true;
      try {
        const response = await laboApi.getHistorial();
        console.log(response.data);
        state.historial = response.data;
      } catch (err) {
        console.error(err);
      } finally {
        loading.value = false;
      }
    };

    const deleteTransaction = async (id) => {
      await laboApi.delete(id);
       await Historial();
      console.log("eliminado");
    };

    const editTransaction = async (id, newAmount, newPrice) => {
      const requestBody = {
        crypto_amount: newAmount,
        money: newPrice
      };

      try {
        await laboApi.edit(id, requestBody);
        console.log("edited successfully");
      } catch (err) {
        console.error(err);
      }
    };

    onMounted(async () => {
      loading.value = true;
      await Historial();
      loading.value = false;
    });

    return {
      state,
      loading,
      editTransaction,
      deleteTransaction,
    };
  },
};
</script>
<style scoped>
input, select{
  width: 50%;
  margin-top: 5px
}
select{
  padding: 0rem 0.75rem;
}
</style>
