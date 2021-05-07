import { useState, useEffect } from 'react';

import Header from '../../components/Header';
import api from '../../services/api';
import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';
import { Food as FoodType } from '../../types';

const Dashboard = (): JSX.Element =>{
  
  const [foods, setFoods] = useState<FoodType[]>([]);
  const [editingFood, setEditingFood] =  useState<FoodType>({} as FoodType);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  
  

  useEffect(() => {

    async function loadFoods(){
      const response = await api.get('/foods');
      setFoods(response.data);
    }
    
    loadFoods();

  },[]); 

  async function handleAddFood (food: FoodType) {
    
    try {
      const response = await api.post('/foods', {
        ...food,
        available: true,
      });
      const { data } = response;

      setFoods([...foods, data]);
    } catch (err) {
      console.log(err);
    }
  }

  async function handleUpdateFood (food : FoodType) {
    
    try {
      const foodUpdated = await api.put(
        `/foods/${editingFood.id}`,
        { ...editingFood, ...food },
      );

      const foodsUpdated = foods.map(f =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data,
      );

      setFoods(foodsUpdated );
    } catch (err) {
      console.log(err);
    }
  }

  async function handleDeleteFood (id : number){
    

    await api.delete(`/foods/${id}`);

    const foodsFiltered = foods.filter(food => food.id !== id);

    setFoods(foodsFiltered);
  }

  function toggleModal() {
    
    setModalOpen( !modalOpen );
  }

  function toggleEditModal  () {
    
    setEditModalOpen( !editModalOpen );
  }

  function handleEditFood (food: FoodType) {
    setEditingFood(food);
    setEditModalOpen(true);    
  }

    return (
      <>
        <Header openModal={toggleModal} />
        <ModalAddFood
          isOpen={modalOpen}
          setIsOpen={toggleModal}
          handleAddFood={handleAddFood}
        />
        <ModalEditFood
          isOpen={editModalOpen}
          setIsOpen={toggleEditModal}
          editingFood={editingFood}
          handleUpdateFood={handleUpdateFood}
        />

        <FoodsContainer data-testid="foods-list">
          {foods &&
            foods.map(food => (
              <Food
                key={food.id}
                food={food}
                handleDelete={handleDeleteFood}
                handleEditFood={handleEditFood}
              />
            ))}
        </FoodsContainer>
      </>
    );
  
};

export default Dashboard;
