import React from "react";


const SearchWorkout = ({search, setSearch}) => {
   
    
return(        
  <input
    type="text"
    className="form-control shadow-sm border-dark w-50"
    placeholder="Search exercise..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
  />

    )
};

export default SearchWorkout;
