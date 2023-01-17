import * as React from 'react'
import { History } from 'history'
import { Form, Button, Input } from 'semantic-ui-react'
import Auth from '../auth/Auth'
import { getUploadUrl, patchPost, uploadFile } from '../api/posts-api'
import dateFormat from 'dateformat'

enum UploadState {
  NoUpload,
  FetchingPresignedUrl,
  UploadingFile,
}

interface EditPostProps {
  match: {
    params: {
      postId: string,
      postName:string
    }
  }
  auth: Auth
  history:History
}

interface EditPostState {
  file: any
  uploadState: UploadState
  newPostCaption:string
}

export class EditPost extends React.PureComponent<
EditPostProps,
EditPostState
> {
  state: EditPostState = {
    file: undefined,
    uploadState: UploadState.NoUpload,
    newPostCaption:this.props.match.params.postName
  }

  handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    this.setState({
      file: files[0]
    })
  }
  calculateDate(): string {
    const date = new Date()   

    return dateFormat(date, 'yyyy-mm-dd') as string
  }
  handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault()
    try {
    if (!this.state.newPostCaption) {
      alert('Please provide caption')
      return
    }
    if (!this.state.file) {
      alert('File should be selected')
      return
    }
    await patchPost(this.props.auth.getIdToken(), this.props.match.params.postId, {
            name: this.state.newPostCaption,
            date:this.calculateDate()
            
          })

      this.setUploadState(UploadState.FetchingPresignedUrl)
      const uploadUrl = await getUploadUrl(this.props.auth.getIdToken(), this.props.match.params.postId)

      this.setUploadState(UploadState.UploadingFile)
      await uploadFile(uploadUrl, this.state.file)

      alert('Post updated!')
      this.props.history.push(`/`)
    } catch (e) {
      alert('Could not upload a file: ' + (e as Error).message)
    } finally {
      this.setUploadState(UploadState.NoUpload)
    }
  }

  setUploadState(uploadState: UploadState) {
    this.setState({
      uploadState
    })
  }
  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newPostCaption: event.target.value })
  }

  render() {
    return (
    
      <div>
        
        <Input          
          fluid
          actionPosition="left"
          placeholder="Caption for the post"
          value={this.state.newPostCaption}
          onChange={this.handleNameChange}
        />
   
 
        <h1>Upload  image</h1>

        <Form onSubmit={this.handleSubmit}>
          <Form.Field>
            <label>File</label>
            <input
              type="file"
              accept="image/*"
              placeholder="Image to upload"
              onChange={this.handleFileChange}
            />
          </Form.Field>

          {this.renderButton()}
        </Form>
      </div>
    )
  }

  renderButton() {

    return (
      <div>
        {this.state.uploadState === UploadState.FetchingPresignedUrl && <p>Uploading image metadata</p>}
        {this.state.uploadState === UploadState.UploadingFile && <p>Uploading file</p>}
        <Button
          loading={this.state.uploadState !== UploadState.NoUpload}
          type="submit"
        >
          Update
        </Button>
      </div>
    )
  }
}
