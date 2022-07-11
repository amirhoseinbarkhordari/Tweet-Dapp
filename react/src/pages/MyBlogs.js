import { useEffect, useState } from "react";
import "./MyBlogs.css";
import axios from "axios";
import BlogCard from "../components/BlogCard";
import {Button} from "web3uikit";
import {useNavigate} from "react-router-dom";
import {useMoralisWeb3Api,useMoralis} from "react-moralis";  

const MyBlogs = () => {

  const Web3API=useMoralisWeb3Api();
  const {isAuthenticated,isInitialized, account} = useMoralis(); 
  const navigate=useNavigate();
  const [blogs , setBlogs]=useState();
  const [blogsContent ,  setBlogsContent]=useState();

  const fetchAllNfts = async () =>{
    const options ={
      chain: "Rinkeby",
      address : account,
      token_address : "0xAa750D49Af36558164Fd177ab101a28E2C1d2d00",
    };

    const ethNFTS= await Web3API.account.getNFTsForContract(options);
    const tokenUri=ethNFTS?.result?.map((data)=>{
      const {metadata , owner_of}=data;
      if (metadata){
        const metadataObj= JSON.parse(metadata);
        const {externalUrl}=metadataObj;
        return {externalUrl,owner_of};
      }
      else{
        return undefined;
      }
    });
    setBlogs(tokenUri);
  };

  const fetchBlogsContent = async ()=>{
    const limit5=blogs?.slice(0,5);
    let contentBlog=[];

    if (limit5){
      limit5.map(async(blog)=>{
        if (blog){
          const {externalUrl,owner_of}=blog;
          const res= await axios.get(externalUrl);
          const text= res.data.text.toString();
          const title= res.data.title;
          contentBlog.push({title,text,owner_of, externalUrl});
        }
      })
    }
    setBlogsContent(contentBlog);
  }

  useEffect(()=>{
    if(blogs && !blogsContent){
      fetchBlogsContent();
    }
  },[blogs,blogsContent]);

  useEffect(()=>{
    if(isAuthenticated && isInitialized){
      fetchAllNfts();
    }
  },[isAuthenticated,isInitialized,account]);

  const clickHandler = ()=>{
    navigate("/newStory")
  };

  return (
    <>
      <div>
        <div className="myBlogsHeader">your blogs</div>
        {blogsContent && blogsContent?.length>0 ?(
            blogsContent?.map((blog,i)=>{
              const {title,text,owner_of,externalUrl}=blog;
              return(
                <BlogCard key={i} title={title} text={text} ownerOf={owner_of} externalUrl={externalUrl}/>
              )
            })
        ) :(
          <div style={{fontSize:"30px" , width:"100%", marginLeft:"40%",}}>
            <p>No Blogs Yet</p>
            <Button text="Create one" onClick={clickHandler}/>
          </div>
        )}
      </div>
    </>
  );
};

export default MyBlogs;
