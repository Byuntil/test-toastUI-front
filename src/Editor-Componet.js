import "@toast-ui/editor/dist/toastui-editor.css";

import { Editor } from "@toast-ui/react-editor";
import { Component, createRef } from "react";

class MyComponent extends Component {
  editorRef = createRef();

  onClick = () => {
    fetch("http://localhost:8080/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: this.editorRef.current.getInstance().getMarkdown(),
      }),
    });
  };

  uploadImage = async (blob) => {
    const formData = new FormData();
    formData.append("file", blob);

    await fetch("http://localhost:8080/s3/upload", {
      method: "POST",
      body: formData,
      accept: "text/plain",
    })
      .then((response) => {
        return response.text();
      })
      .catch((err) => {
        console.log(err);
      });
  };
  render() {
    return (
      <div>
        <Editor
          initialValue="내용을 입력하세요"
          previewStyle="vertical"
          height="600px"
          initialEditType="markdown"
          useCommandShortcut={true}
          ref={this.editorRef}
          hooks={{
            addImageBlobHook: (blob, callback) => {
              const img_url = this.uploadImage(blob);
              console.log(img_url);
              callback(img_url, "image");
            },
          }}
        />
        <button onClick={this.onClick}>저장</button>
      </div>
    );
  }
}

export default MyComponent;
