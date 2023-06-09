import { Link } from 'react-router-dom';
import {LinkContainer} from 'react-router-bootstrap'
import { fetchCategories } from '../../../Redux/Slices/Shop/CategoriesSlice'
import React, { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux";
import './Categories.css'

const Categories = () => {
    const dispatch = useDispatch();
    const categories = useSelector((state) => state.categories.categories);
    const categoriesCount = useSelector((state) => state.categories.count);
    const status = useSelector((state) => state.categories.status);
    const error = useSelector((state) => state.categories.error);
    const [limit, setLimit] = useState(5);
    // Status from fech data 
    const fechStatus = ()=>{
        if(status === "loading"){
            return <p className='loading'>{status}</p>
        } else if(error){
            return <p className='failed'>Failed to get data, please try again!</p>
        }
    }

    // Pagination
    const handlePagination = (e)=>{
        if(limit < categoriesCount)
            setLimit(limit + 5)
    }
    const isAll = ()=>{
        if(limit < categoriesCount)
            return <p  onClick={handlePagination} className={`load_more`}>Load more</p>     
    }


      useEffect(() => {
        dispatch(fetchCategories({limit: limit, page: 1}));
      }, [dispatch, limit]);

    return ( 

        <div className="col-md-3">
            <div className="card mb-4">
                <div className={`card_header card-header`}>Categories</div>
                {fechStatus()}
                <ul className="list-group list-group-flush">
                    <LinkContainer to={`/shop`}>
                            <Link activeclassname={`active`} className="list-group-item list-group-item-action">All Products</Link>
                    </LinkContainer>
                    {categories.map((category, index) => 
                        <div key={category.id + Date.now().toString()}>
                            <LinkContainer to={`/shop/${category.id}`}>
                            <Link activeclassname={`active`} className="list-group-item list-group-item-action">{category.name} ({category.num_products})</Link>
                            </LinkContainer>
                        </div>
                    )}
                </ul>
                    {isAll()}          
            </div>
        </div>


     );
}
 
export default Categories;