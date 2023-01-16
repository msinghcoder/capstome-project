
import { History } from 'history'

import * as React from 'react'
import {
  Button,  
  
  Grid,
  
  Icon,
    
  Loader
} from 'semantic-ui-react'

import {  deletePost, getPosts } from '../api/posts-api'
import Auth from '../auth/Auth'
import { Post } from '../types/Post'
import "./Posts.css";

interface TodosProps {
  auth: Auth
  history: History
}

interface TodosState {
  posts: Post[] 
  loadingPosts: boolean
  currentUser:any
}

export class Todos extends React.PureComponent<TodosProps, TodosState> {
  state: TodosState = {
    posts: [],   
    loadingPosts: true,
    currentUser:this.props.auth.getUserProfile()
  }

   

  

  onEditButtonClick = (todoId: string,todoName: string) => {
    console.log(this.state.currentUser)
    this.props.history.push(`/todos/${todoId}/${todoName}/edit`)
  }
  onAddButtonClick = () => {
    this.props.history.push(`/todos/add`)
  }

  

  onTodoDelete = async (todoId: string) => {
    try {
      await deletePost(this.props.auth.getIdToken(), todoId)
      this.setState({
        posts: this.state.posts.filter(post => post.todoId !== todoId)
      })
    } catch {
      alert('Post deletion failed')
    }
  }

 
  async componentDidMount() {
    try {
      const posts = await getPosts(this.props.auth.getIdToken())
      this.setState({
        posts,
        loadingPosts: false
      })
    } catch (e) {
      alert(`Failed to fetch posts: ${(e as Error).message}`)
    }
  }

  render() {
    return (
      <div>
        <div className="Header">
          <label><strong>Posts</strong></label>
          <Button
                  icon
                  color="red"
                  onClick={() => this.onAddButtonClick()}
                >
                  <Icon name="add" />
                </Button>
          </div>

       

        {this.renderPosts()}
      </div>
    )
  }

 
  renderPosts() {
    if (this.state.loadingPosts) {
      return this.renderLoading()
    }

    return this.renderPostsList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading Posts
        </Loader>
      </Grid.Row>
    )
  }

  renderPostsList() {
    return (
    <div>
        {this.state.posts.map((post, pos) => {
          return ( 
           
                <article className="Post" ref="Post" key={post.todoId}>
                   <header className='Header'>

<div className="Post-user">

  <div className="Post-user-profilepicture">

    <img src={this.state.currentUser.picture} alt="User" />

  </div>

  <div className="Post-user-nickname">

    <span>{this.state.currentUser.nickname}</span>

  </div>

</div>
<div className='Post-user'>
<Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(post.todoId,post.name)}
                >
                  <Icon name="pencil" />
                </Button>
                <Button
                  icon
                  color="red"
                  onClick={() => this.onTodoDelete(post.todoId)}
                >
                  <Icon name="delete" />
                </Button>
</div>

</header>
              

 {post.attachmentUrl && (
                <div className="Post-image">
                 <div className="Post-image-bg">                
                   <img alt="Icon Living" src={post.attachmentUrl}   />                
                 </div>                
                </div>               
              )}

 <div className="Post-caption">

 <strong>{this.state.currentUser.nickname} </strong> {post.name}

 </div>

 </article>
              
             
             
          
          )
        })}
   </div>
    )
  }
 
 
}
