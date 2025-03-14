import React, { createContext, useEffect, useState } from "react";

export const Context = createContext();

export const ContextProvider = ({ children }) => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [searchText, setSearchText] = useState('');
  const [filteredFoods, setFilteredFoods] = useState([]);

  const fetchFoods = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://192.168.1.167:8000/foods');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setFoods(data);
      setFilteredFoods(data);
      setError(null);
    } catch (error) {
      console.error("Fetch error:", error);
      setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchFoods();
  }, []);

  useEffect(() => {
    if (!foods.length) return;

    let result = [...foods];

    if (selectedCategory !== 'Tất cả') {
      result = result.filter(food => food.category === selectedCategory);
    }

    if (searchText) {
      const searchLower = searchText.toLowerCase();
      result = result.filter(food => 
        food.name.toLowerCase().includes(searchLower) ||
        food.description.toLowerCase().includes(searchLower)
      );
    }

    setFilteredFoods(result);
  }, [foods, selectedCategory, searchText]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchFoods();
  };

  return (
    <Context.Provider value={{ 
      foods,
      filteredFoods,
      setFoods,
      loading,
      error,
      refreshing,
      refreshFoods: handleRefresh,
      selectedCategory,
      setSelectedCategory,
      searchText,
      setSearchText
    }}>
      {children}
    </Context.Provider>
  );
};

export default ContextProvider;