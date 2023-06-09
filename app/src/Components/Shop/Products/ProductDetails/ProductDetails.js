import { Button, Modal } from 'react-bootstrap';
import style from './ProductDetails.module.css';
import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { setProducts } from "../../../../Redux/Slices/Cart/CartProductsSlice";
import {BsHeart, BsHeartFill} from 'react-icons/bs'
import {fetchUserCart} from '../../../../Redux/Slices/Cart/userCartSlice'
import { useLoaderData, useNavigate, useRouteLoaderData } from 'react-router';
import { addProductToCart } from '../../../../Redux/Slices/Cart/AddToCartSlice';
import { updateUserCart } from '../../../../Redux/Slices/Cart/UpdateCartSlice';
import formattedCurrency from '../../../UI/Currency';
import { getAuthToken } from '../../../../util/auth';
import { AddToWishlist } from '../../../../Redux/Slices/Wishlist/Wishlist';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


function ProductDetails({ show, onCloseModal ,product }) {
  const userInfo = useLoaderData();
  const token = getAuthToken();
  const dispatch = useDispatch();
  const { products, status } = useSelector((state) => state.userCart);
  const { updatedCart } = useSelector((state) => state.updateCart);
  const imageUrl = 'http://localhost:8000/'
  const [selectedValue, setSelectedValue] = useState('');
  const  [cartData, setCartData] = useState(JSON.parse(localStorage.getItem('AROACart')))
  const { visitorProducts} = useSelector((state) => state.cartProducts);
  const [addButton, setAddButton] = useState(false);
  const [addText, setAddText] = useState('Add to Cart');
  const [addtoWish, setaddtoWish] = useState(false)
    const navigate = useNavigate();
      useEffect(()=>{
        if(!token){
        setCartData(JSON.parse(localStorage.getItem('AROACart')));
        dispatch(setProducts(cartData));
      }else{
        dispatch(fetchUserCart())
      }
  
      }, [dispatch, updatedCart, addtoWish])

      
    const handleSelectChange = (event) => {
      setSelectedValue(event.target.value);
    };

    const submitProductToCart = (data) => {
      if(selectedValue === '') return
      if(token){
   
         dispatch(fetchUserCart())

          if(products.length === 0){
            dispatch(addProductToCart({ product: data.id, quantity: parseInt(selectedValue) }));
            
          }else{
           
            let productIndex = products.findIndex((e) => e.data.id === data.id)

            if(products[productIndex] && products[productIndex].qty + parseInt(selectedValue) <= 10){ 
                dispatch(updateUserCart({product: products[productIndex].data.id, quantity: products[productIndex].qty + parseInt(selectedValue), id: products[productIndex].itemId}))
  
            }else if (!products[productIndex]){
              dispatch(addProductToCart({ product: data.id, quantity: parseInt(selectedValue) }));

              

            }
          }
      }

      else{
          const cartData = JSON.parse(localStorage.getItem('AROACart'));
          if (!cartData) {
            localStorage.setItem('AROACart', JSON.stringify([{ data, qty: parseInt(selectedValue), totalPrice:  parseInt(selectedValue) * data.price}]));
            return
          }

          const CurrentItem = cartData.findIndex(e => e.data.id === data.id)
          if(cartData[CurrentItem] && cartData[CurrentItem].qty + parseInt(selectedValue) <= 10){  
              cartData[CurrentItem].qty += parseInt(selectedValue) 
              cartData[CurrentItem].totalPrice = cartData[CurrentItem].qty * data.price
              localStorage.setItem('AROACart', JSON.stringify(cartData));

          }else if (!cartData[CurrentItem]){
            cartData.push({ data, qty: parseInt(selectedValue), totalPrice:  parseInt(selectedValue) * data.price });
            localStorage.setItem('AROACart', JSON.stringify(cartData));
          }   
          dispatch(setProducts(cartData))
      } 
      setAddButton(true)
      setAddText('Added')
      setTimeout(() => {
        setAddButton(false)
        setAddText('Add to Cart')
      }, 1000);
    };

    const qtyOptions = ()=>{
        const selections = []
        if(product.quantity >= 10){
            for(let i = 1; i <= 10; i++){
                 selections.push(
                  <option key={i} value={i}>{i}</option>)
              }
        }
        else{
            for(let i = 1; i <= product.quantity; i++){
                selections.push(<option key={i}  value={i}>{i}</option>)
              }
        }
        return selections;
    }
    
    function addToWishListHandler(productId) {
      if(!token)
        navigate('/login')

      const info = {
        user: userInfo.id,
        product: productId
      };
      dispatch(AddToWishlist(info))
      setaddtoWish(true)
      
    }
  return (
    <>
      <Modal
      size='xl'
        show={show}
        onHide={onCloseModal}
        dialogClassName={style.productModalDialog}
        contentClassName={style.productModalContent}>
        <Modal.Header closeButton>
          <Modal.Title>{product.name} </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className={` ${style.modal_body} row`}>
              <img
                src={`${imageUrl}${product.productPic}`} 
                className="img-responsive col-md-6"
                alt="product"
                height={500}
              />
            <div className={` ${style.product_content} col-md-6`}>
              <h5>
                Product ID: <span>{product.id}</span>
              </h5>
              <p className={style.description}>{product.description}</p>
              <h3 className={style.cost}>
                <span className={`glyphicon glyphicon-usd`}></span>{formattedCurrency.format(product.price - 5)}
                <small className={style.pre_cost}>
                  <span className="glyphicon glyphicon-usd"></span> {formattedCurrency.format(product.price)}
                </small>
              </h3>
              <div className={`${style.action} row`}>
                <div className="col-sm-12 quantity">
                  <select defaultValue={'DEFAULT'} onChange={handleSelectChange} className="form-control" name="select">
                    <option  value="DEFAULT" disabled>QTY</option>
                    {qtyOptions()}
                  </select>
                </div>
                <div className='row'>
                  {product.quantity !== 0 &&
                  <Button       style={{
                      backgroundColor: addButton ? 'green': '',
                      color: addButton ? 'white' : '',
                      fontSize: addButton ? '20px' : '',
                      // Add more styles based on the case
                    }}
                
                onClick={() => submitProductToCart({id:product.id, name:product.name, price:product.price, productPic:product.productPic, quantity: product.quantity})} className={`${style.add_to_cart} col-sm-10 `}>{addText}</Button>  
               }    

               {!addtoWish && 
                <BsHeart beatFade size={'60'} onClick={() => addToWishListHandler(product.id)} className={`${style.add_to_fav} col-sm-1 `} />
               }
                 {addtoWish &&
                <BsHeartFill fill='purple' beatFade size={'60'} className={`${style.add_to_fav} col-sm-1 `} />
               }
                </div>                                
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default ProductDetails;
