// SearchBar.js
import React, { useState, useEffect } from 'react';

function SearchBar({searchParams, setSearchParams}) {
  // const [searchParams, setSearchParams] = useState({
  //   category: defaultValues.category || '',
  //   difficulty: defaultValues.difficulty || '',
  //   keyword: defaultValues.keyword || ''
  // });

  // useEffect(() => {
  //   setSearchParams(prev => ({
  //     ...prev,
  //     ...defaultValues
  //   }));
  // }, [defaultValues]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newParams = {
      ...searchParams,
      page: 1,
      [name]: value
    };
    setSearchParams(newParams);
  };

  return (
    <form className="bg-white p-6 rounded-lg shadow-md">
      <div className="grid gap-4 md:grid-cols-3">
        <select
          name="category"
          value={searchParams.category}
          onChange={handleChange}
          className="border rounded-lg px-3 py-2"
        >
          <option value="">All Categories</option>
          <option value="Algebra">Algebra</option>
          <option value="Geometry">Geometry</option>
          <option value="Intermediate Algebra">Intermediate Algebra</option>
          <option value="Number Theory">Number Theory</option>
          <option value="Prealgebra">Prealgebra</option>
          <option value="Precalculus">Precalculus</option>
        </select>

        <select
          name="difficulty"
          value={searchParams.difficulty}
          onChange={handleChange}
          className="border rounded-lg px-3 py-2"
        >
          <option value="">All Difficulties</option>
          <option value="Very Easy">Very Easy</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
          <option value="Very Hard">Very Hard</option>
        </select>

        <input
          type="text"
          name="keyword"
          placeholder="Search exercises..."
          value={searchParams.keyword}
          onChange={handleChange}
          className="border rounded-lg px-3 py-2"
        />
      </div>
    </form>
  );
}

export default SearchBar;