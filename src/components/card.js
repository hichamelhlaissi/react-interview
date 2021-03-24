import React, { useState, useEffect, useCallback } from "react";
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import ThumbDownAltIcon from '@material-ui/icons/ThumbDownAlt';
import Grid from '@material-ui/core/Grid';
import DeleteIcon from '@material-ui/icons/Delete';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import movies from './movies.js';
import Pagination from '@material-ui/lab/Pagination';

export default function RecipeReviewCard() {
    const [listMovies, setListMovies]=useState([]);
    useEffect(() => {
        setListMovies(movies);
    }, [movies]);
    const [category, setCategory] = useState([])
    const [filter, setFilter] = useState([])
    const [categoryName, setCategoryName]=useState("all");

    const [currentPage, setCurrentPage] = useState(1);
    const [moviePerPage, setMoviePerPage] = useState(4);

    const indexOfLastMovie = currentPage * moviePerPage;
    const indexOfFirstMovie = indexOfLastMovie - moviePerPage;
    const currentMovies = listMovies.slice(indexOfFirstMovie, indexOfLastMovie);

    useEffect(()=>{
        setCategory(listMovies.map(item =>{
            return item.category;
        }))
    },[listMovies]);

    useEffect(() => {
        setFilter(category.filter(onlyUnique))
    },[category])

    const classes = useStyles();

    const onlyUnique=(value, index, self)=> {
        return self.indexOf(value) === index;
    }

    const handleDelete=(key)=>{
        setListMovies(listMovies.filter(item => item.id !== key));
    }

    const handleLike=(key)=>{
        setListMovies(listMovies.map(item => {
            if (item.id === key){
                item.likes= Math.max(0,item.likes+1);
                item.dislikes=Math.max(0,item.dislikes-1);
            }
            return item;
        }));
    }

    const handleDislike=(key)=>{
        setListMovies(listMovies.map(item => {
            if (item.id === key){
                item.likes= Math.max(0,item.likes-1);
                item.dislikes=Math.max(0,item.dislikes+1);
            }
            return item;
        }));
    }

    const handleFilter=(event)=>{
        setCategoryName(event.target.value)
    }

    let pageNumbers = [];
    for (let i = 1; i <= Math.ceil(listMovies.length / moviePerPage); i++) {
        pageNumbers.push(i);
    }
   const handlePagination=(e)=> {
        setCurrentPage(e.target.id);
    }

    const handleMoviePerPage=(e)=>{
        setMoviePerPage(e.target.value)
    }

    const Rendering =({data})=>{
        return(
            <Card className={classes.root} style={{width:200, marginLeft:10, marginTop:10}}>
                <CardHeader/>
                <Typography style={{fontWeight:"bold"}}>{data.title}</Typography>
                <Typography style={{fontWeight:"-moz-initial"}}>{data.category}</Typography>
                <CardActions disableSpacing>
                    <IconButton aria-label="like" onClick={()=>handleLike(data.id)}>
                        <Typography>{data.likes} </Typography>
                        <ThumbUpAltIcon/>
                    </IconButton>
                    <IconButton aria-label="dislike" onClick={()=>handleDislike(data.id)}>
                        <Typography>{data.dislikes} </Typography>
                        <ThumbDownAltIcon/>
                    </IconButton>
                    <IconButton aria-label="delete" style={{marginLeft:50}} onClick={()=>handleDelete(data.id)} >
                        <DeleteIcon />
                    </IconButton>
                </CardActions>
            </Card>
        )
    }
    return (
        <div>


            <Select
                value={categoryName}
               onChange={handleFilter}
            >
                <MenuItem value="all">
                    <em>All</em>
                </MenuItem>
                {
                    filter.map(data=>{
                        return(
                            <MenuItem value={data}>{data}</MenuItem>
                        )
                    })
                }
            </Select>

        <Grid container className={classes.root} spacing={2}>

            {
                currentMovies.map(data=>{
                    if (categoryName === "all"){
                        return(
                            <Rendering data={data}/>
                        )
                    }else if (categoryName === data.category){
                        return(
                            <Rendering data={data}/>
                        )
                    }else return null

               })
            }


        </Grid>
            <div style={{display:"flex", marginTop:30}}>
                <nav aria-label="Page navigation example" style={{marginRight:10}}>
                    <ul className="pagination">
                        {
                            pageNumbers.map(number => {
                                return (
                                    <li className="page-item" style={{cursor:"pointer"}}>
                                        <a className="page-link" key={number} id={number} onClick={handlePagination}>{number}</a>
                                    </li>
                                );
                            })
                        }
                    </ul>
                </nav>
                <div>
                <Select
                    value={moviePerPage}
                    onChange={handleMoviePerPage}
                >
                    <MenuItem value={4}>
                        <em>4</em>
                    </MenuItem>
                    <MenuItem value={8}>8</MenuItem>
                    <MenuItem value={12}>12</MenuItem>

                </Select>
                </div>
            </div>
        </div>
    );
}

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,

    },
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
    },
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
    avatar: {
        backgroundColor: red[500],
    },
}));
