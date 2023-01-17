import { History } from 'history'

import * as React from 'react'
import { Button, Grid, Icon, Loader } from 'semantic-ui-react'

import { deletePost, getPosts } from '../api/posts-api'
import Auth from '../auth/Auth'
import { Post } from '../types/Post'
import './Posts.css'

interface PostsProps {
  auth: Auth
  history: History
}

interface PostsState {
  posts: Post[]
  loading: boolean
  currentUser: any
}

export class Posts extends React.PureComponent<PostsProps, PostsState> {
  state: PostsState = {
    posts: [],
    loading: true,
    currentUser: this.props.auth.getUserProfile()
  }

  onEditButtonClick = (postId: string, postName: string) => {   
    this.props.history.push(`/posts/${postId}/${postName}/edit`)
  }
  onAddButtonClick = () => {
    this.props.history.push(`/posts/add`)
  }

  onPostDelete = async (postId: string) => {
    try {
      this.setState({        
        loading: true
      })
      await deletePost(this.props.auth.getIdToken(), postId)
      this.setState({
        loading:false,
        posts: this.state.posts.filter((post) => post.postId !== postId)
      })
      alert('Post deleted.')
    } catch {
      alert('Post deletion failed')
    }
  }

  async componentDidMount() {
    try {
      const posts = await getPosts(this.props.auth.getIdToken())
      this.setState({
        posts,
        loading: false
      })
    } catch (e) {
      alert(`Failed to fetch posts: ${(e as Error).message}`)
    }
  }

  render() {
    return (
      <div>
        <div className="Header">
          <label>
            <strong>Posts</strong>
          </label>
          <Button icon color="red" onClick={() => this.onAddButtonClick()}>
            <Icon name="add" />
          </Button>
        </div>

        {this.renderPostsList()}
      </div>
    )
  }

  // renderPosts() {
  //   if (this.state.loading) {
  //     return this.renderLoading()
  //   }

  //   return this.renderPostsList()
  // }

  // renderLoading() {
  //   return (
  //     <Grid.Row>
  //       <Loader indeterminate active inline="centered">
  //         Loading 
  //       </Loader>
  //     </Grid.Row>
  //   )
  // }

  renderPostsList() {
    return (
      <div>
       {this.state.loading && <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading 
        </Loader>
      </Grid.Row>}
        {this.state.posts.map((post, pos) => {
          return (
            <article className="Post" ref="Post" key={post.postId}>
              <header className="Header">
                <div className="Post-user">
                  <div className="Post-user-profilepicture">
                    <img src={this.state.currentUser.picture} alt="User" />
                  </div>

                  <div className="Post-user-nickname">
                    <span>{this.state.currentUser.nickname}</span>
                  </div>
                </div>
                <div className="Post-user">
                  <Button
                    icon
                    color="blue"
                    onClick={() =>
                      this.onEditButtonClick(post.postId, post.name)
                    }
                  >
                    <Icon name="pencil" />
                  </Button>
                  <Button
                    icon
                    color="red"
                    onClick={() => this.onPostDelete(post.postId)}
                  >
                    <Icon name="delete" />
                  </Button>
                </div>
              </header>

              {post.attachmentUrl && (
                <div className="Post-image">
                  <div className="Post-image-bg">
                    <img alt="Icon Living" src={post.attachmentUrl} />
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
