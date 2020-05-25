import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { addPost } from "../../actions/post";
import SunEditor, {buttonList} from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css'; //Import sun editor's css files!! 
import { createProfile, getCurrentProfile } from "../../actions/profile";


var conectadoConDropbox = false;
const PostForm = ({ addPost, 
profile: {profile, loading},
createProfile,
    getCurrentProfile,}) => {
  const [text, setText] = useState("");
  const[showText, setShowText] = useState(true);
  /*function agregarImagen() {
    alert(
      `Selected File - ${fileInput.current.files[0].lastModified}`
    );
    
  };
   const fileInput = React.createRef();*/
   var buttonList2 = [
    ['undo', 'redo',
    'font', 'fontSize', 'formatBlock',
    'paragraphStyle', 'blockquote',
    'bold', 'underline', 'italic', 'strike', 'subscript', 'superscript',
    'fontColor', 'hiliteColor', 'textStyle',
    'removeFormat',
    'outdent', 'indent',
    'align', 'horizontalRule', 'list', 'lineHeight',
    'table', 'link', 'image', 'video', 'audio', /** 'math', */ // You must add the 'katex' library at options to use the 'math' plugin.
    'fullScreen', 'showBlocks', 'codeView',
    'preview', 'print', 'save', 'template']];
    //console.log(buttonList2[0][25]);
    var lolsito;
   useEffect(() => {
        getCurrentProfile();
        console.log(profile);
        PostForm.lolsito = !profile ? "" : profile.dropbox;
        if(lolsito){
          conectadoConDropbox = true;
        }
        //console.log(lolsito);
        if(lolsito){
          console.log(buttonList2[0][25]);
          buttonList2[0].splice(25,1);
          console.log(buttonList2[0][25]);

        }
        
    }, [loading, getCurrentProfile]);
console.log("LOLSITO??: "+PostForm.lolsito);
  function handleChange(content){
    setText(content);
  }
  var respuesta;
  async function handleImageUploadBefore(files, info){
    console.log(files, info);
  }
  function dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
      while(n--){
          u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], filename, {type:mime});
  }

  async function handleImageUpload(targetImgElement, index, state, imageInfo, remainingFilesCount){
    if(imageInfo){
      console.log("NOMBRE ES: "+imageInfo.name);
      //SUBIENDO A DROPBOX
      require('isomorphic-fetch'); // or another library of choice.
      var Dropbox = require('dropbox').Dropbox;
      console.log(profile);
  
      var file = dataURLtoFile(targetImgElement.src, imageInfo.name)
  
      var dbx = new Dropbox({ accessToken: PostForm.lolsito });
      console.log(imageInfo.name)
      const lol = await dbx.filesUpload({
        contents: file,
        path: "/images/"+imageInfo.name,
        autorename: true
  
      }).then(function(response){
        dbx.sharingCreateSharedLink({
          path: "/images/"+response.name,
          pending_upload: 'file'
      }).then(function(response){
      console.log(response);
      console.log("STR BEFORE: "+response.url);
      var str = response.url.replace(/0$/,"1");
      console.log("STR: "+str);
      targetImgElement.src = str;
      });
      })
      //RECUPERANDO LINK COMPARTIDO
      
    }
    
  }
  async function handleVideoUpload(targetElement, index, state, info, remainingFilesCount){
    console.log("ARREGLITO?");
    if(info.file){
      console.log(info.file);
              var Dropbox = require('dropbox').Dropbox;
              var dbx = new Dropbox({ accessToken: PostForm.lolsito});
              const lol = await dbx.filesUpload({
                  contents: info.file,
                  path: "/video/"+info.file.name,
                  autorename: true
          
              }).then(function(response){
                  console.log(response);
  
                    dbx.sharingCreateSharedLink({
                        path: "/video/"+response.name,
                        pending_upload: 'file'
                    }).then(function(response){
                    console.log(response);
                    console.log("STR BEFORE: "+response.url);
                    var str = response.url.replace(/0$/,"1");
                    console.log("STR: "+str);
                    targetElement.src = str;
                    });
  
              });
    }
    
            //
  }

  async function handlerVideoUploadBefore(files, info){
    console.log(files, info);
    return true;
   
  }

  return (
    <div class="post-form">
      <div class="bg-primary p">
        <h3>Comparte algo</h3>
      </div>
      <br/>
      {!conectadoConDropbox ? <Link to="/edit-profile" className="btn btn-dark">
        Conectar con Dropbox
      </Link> : null}
      
      <form
        class="form my-1"
        onSubmit={(e) => {
          e.preventDefault();
          addPost({ text });
          setText("");
        }}
      >
        
        <SunEditor
        lang="es"
        name="text"
        value={text}
        required
        onChange={handleChange}
        onImageUploadBefore={handleImageUploadBefore}
        onVideoUploadBefore={handlerVideoUploadBefore}
        onImageUpload={handleImageUpload}
        onVideoUpload={handleVideoUpload}
        setOptions={{
          height: 200,
          buttonList: buttonList2,
          stickyToolbar: -1,
          videoFileInput: true,
          videoUrlInput: false,
          videoUploadHeader: {
            "Authorization": "Bearer "+PostForm.lolsito,
            "Dropbox-API-Arg": {
              "path": "/video/",
              "mode": "add",
              "autorename": true,
              "mute": false,
              "strict_conflict": false
          },
          "Content-Type": "application/octet-stream"
          },
          videoUploadUrl: "https://content.dropboxapi.com/2/files/upload"
        }}
        />
        
        

        

        <input type="submit" class="btn btn-dark my-1" value="Enviar" />
      </form>
    </div>
  );
};

/*
<SunEditor
        lang="es"
        name="text"
        value={text}
        required
        setOptions={{
          height: 200,
          buttonList: buttonList2,
          stickyToolbar: -1,
          videoFileInput: true
        }}
        />



Jodit Editor
<JodiEditor
                ref={editor}
                value={content}
                tabIndex={1} //tab index of text area
                onBlur={newContent => setContent(newContent)} //only for update the content performance reasons
                onChange={newContent => {}}
                ></JodiEditor>
*/
/*Old text area
<textarea
    name="text"
    cols="30"
    rows="5"
    placeholder="Crear un post"
    value={text}
    onChange={e => setText(e.target.value)}
    required
/>
<textarea
          name="text"
          cols="30"
          rows="5"
          placeholder="Crear un post"
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
        />
        <div class="row">
          <div class="col col-6">
            <label>Agregar Imagen:</label>
            <br />
            <input
              type="file"
              id="imagen"
              name="imagen"
              accept="image/png, image/jpeg"
              ref = {fileInput}
            />
            <br />
            <button class="btn btn-dark" onClick={agregarImagen}>Agregar</button>
          </div>
          
        </div>
*/

PostForm.propTypes = {
  addPost: PropTypes.func.isRequired,
};
const mapStateToProps = state => ({
  profile: state.profile,
});

export default connect(
  mapStateToProps, 
  {createProfile, getCurrentProfile, addPost}
  )(withRouter(PostForm));
