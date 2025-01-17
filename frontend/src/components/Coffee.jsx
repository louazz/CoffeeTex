import React from 'react';
import styled from 'styled-components';
import { useNavigate } from "react-router";

const Button = styled.a`
  line-height: 2;
  height: 5rem;
  text-decoration: none;
  display:inline-flex;
  border-radius: 5px;
  border: 1px solid transparent;
  padding: 0.7rem 1rem 0.7rem 1rem;
  font-size: 2rem;
  letter-spacing: 0.6px;
  box-shadow: 0px 1px 2px rgba(190, 190, 190, 0.5);
  transition: 0.3s all linear;
   font-family: "Kode Mono", monospace;
  font-optical-sizing: auto;
  font-weight: 400;
  font-style: normal;
  background-color: #ffffc5;
  color: #002f6c;
  &:hover, &:active, &:focus {
    text-decoration: none;
    box-shadow: 0px 1px 2px 2px rgba(190, 190, 190, 0.5);
    opacity: 0.85;
    color:#FFFFFF;
  }
`;

const Image = styled.img`
  height: 34px;
  width: 35px;
  margin-bottom: 1px;
  box-shadow: none;
  border: none;
  vertical-align: middle;
`;


function Coffee() {
  const navigate = useNavigate()

  return (
    <>
    <div className='box'>
    <div className='one'>
  <a  target="_blank"  href="https://buymeacoffee.com/coffeetex"><Image  src="https://cdn.buymeacoffee.com/buttons/bmc-new-btn-logo.svg" className='float-right'/></a>  
    </div>
    <div className='one'>
    <p className='float-left'>Show your support and buy me a coffee</p>
    </div>
    </div>
          </>
  );
}

export default Coffee;