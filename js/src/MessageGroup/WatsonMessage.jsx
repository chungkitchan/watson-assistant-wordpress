import React, { Component } from 'react';

export default class WatsonMessage extends Component {
  constructor(props) {
    super(props);

    let { content } = props
    let showComment = false

    // console.log("In WatsonMessage.constructor(), content:"+JSON.stringify(Object.keys(content)))
    // console.log("In WatsonMessage.constructor(), this.props.keys:"+JSON.stringify(Object.keys(this.props)))
    // console.log("In WatsonMessage.constructor(), this.props:"+JSON.stringify(this.props))
    if (props.showPauses) {
      let i = content.findIndex(
        item => item.response_type === 'pause'
      );
      this.state = {
        currentIndex: (i === -1) ? content.length : i,
        typing: (i === -1) ? false : content[i].typing
      };
    } else {
      this.state = {
        currentIndex: content.length,
        typing: false
      };
    }
  }

  componentDidMount() {
    this.nextPause();
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextState.currentIndex !== this.state.currentIndex;
  }

  componentDidUpdate(prevProps) {
    this.props.scroll();
    this.nextPause();
  }

  clearCommentForm(id) {
    document.getElementById(id+'-comment-form').classList.add('hidden');
    document.getElementById(id+'-comment-field').value='';
  }

  sendFeedback(id,feedbackType){
    console.log("sendFeedback() called, feedbackType:",feedbackType);
    let feedback = { id: id }
    if (feedbackType=='comment')  {
       document.getElementById(id+'-comment-form').classList.remove('hidden'); 
       return;
    }  else if (feedbackType=='commentForm')  {
       feedback['comment']=document.getElementById(id+'-comment-field').value; 
       document.getElementById(id+'-comment-form').classList.add('hidden');
       document.getElementById(id+'-comment-field').value='';
    }  else if (feedbackType=='ratingThumbsup') {
       feedback['rating']=1;
    }  else if (feedbackType='ratingThumbsdown')  {
       feedback['rating']=-1;
    }  
    console.log("sendFeedback(), sending feedback: "+JSON.stringify(feedback)+" to URL: "+watsonconvSettings.feedbackUrl);
    fetch(watsonconvSettings.feedbackUrl, {
        headers: {
            'Content-Type': 'application/json',
            'X-WP-Nonce': watsonconvSettings.nonce
        },
        credentials: 'same-origin',
        method: 'POST',
        body: JSON.stringify(feedback)
    }).then(response => {
        // console.log("response: ",response.json())
        if (!response.ok) {
            throw Error('Feedback could not be sent.');
        }
        return response.json();
    }).then(data => {
        console.log("sendFeedback(), response: ", data);
        if (data.indexOf('ok')!=-1) {
           console.log("sendFeedback(): %s susccessful",id+'-ok');
           document.getElementById(id+'-ok').classList.remove('hidden');
           setInterval(function(){  document.getElementById(id+'-ok').classList.add('hidden');; }, 5000);
        }  else {
           console.log("sendFeedback(): %s error",id+'-fail');
           document.getElementById(id+'-fail').classList.remove('hidden');
           setInterval(function(){  document.getElementById(id+'-fail').classList.add('hidden');; }, 5000);
        }
    }).catch(error => {
        console.log(error);
    });
}

  nextPause() {
    let { content } = this.props;
    let { currentIndex } = this.state;

    if (currentIndex < content.length) {
      let i = content.findIndex(
        (item, index) => index > currentIndex && item.response_type === 'pause'
      );

      setTimeout(() => {
        this.setState({
          currentIndex: (i === -1) ? content.length : i,
          typing: (i === -1) ? false : content[i].typing
        });
      }, content[currentIndex].time);
    }
  }

  render({sendMessage,sendFeedback, from, content, options}, { typing, currentIndex }) {
    let response = [], legacyOptions = true;

    // console.log("In WatsonMessage.render(), this.props: "+JSON.stringify(this.props,null,2))
    // console.log("In WatsonMessage.render(), this.props.context.skills: "+JSON.stringify(this.props.context.skills,null,2))
    for (let i = 0; i < currentIndex; i++) {
      switch(content[i].response_type) {

        case 'option':
          legacyOptions = false;

          if (content[i].title || content[i].description) {
            response.push(
              <div
                key={response.length}
                className={`message ${from}-message watson-font`}
              >
                <strong>{content[i].title}</strong>
                <p>{content[i].description}</p>
              </div>
            );
          }

          response.push(...content[i].options.map(
            (option, index) => (
              <div 
                key={response.length + index} className={`message message-option watson-font`} 
                onClick={() => { sendMessage(option.value, true); }}
              >
                {option.label}
              </div>
            )
          ));

          break;

        case 'text':
          response.push(
            <div
              key={response.length}
              className={`message ${from}-message watson-font`}
              dangerouslySetInnerHTML={{__html: content[i].text}}
            ></div>
          );
          break;

        case 'image':
          response.push(
            <div
              key={response.length}
              className={`message ${from}-message watson-font`}
            >
              <span dangerouslySetInnerHTML={{__html: content[i].title}}></span>
              <img src={content[i].source} title={content[i].description}></img>
            </div>
          );
          break;

      }
    }
    console.log("In WatsonMessage.constructor(), _id: "+this.props.context._id)
    if ((this.props.context && this.props.context.skills && this.props.context.skills['main skill'] && 
      this.props.context.skills['main skill'].user_defined && this.props.context.skills['main skill'].user_defined._id ) || 
       (this.props.context._id)) {
        let id = ( this.props.context._id ?this.props.context._id: this.props.context.skills['main skill'].user_defined._id )  
        // let id = "id"
        response.push(
          <div class={`message ${from}-message watson-font`}>
             <span className='dashicons dashicons-thumbs-up watson-font'
                   onClick={() => { this.sendFeedback(`${id}`, "ratingThumbsup"); }}
                   data-tip='Useful'></span>          
             <span class='dashicons dashicons-thumbs-down watson-font'
                   onClick={() => { this.sendFeedback(`${id}`, "ratingThumbsdown"); }}
                   data-tip='Not Useful'></span>          
             <span class='dashicons dashicons-admin-comments watson-font'
                   onClick={() => { this.sendFeedback(`${id}`,"comment") }}
                   data-tip='Comment'></span> 
          </div>
        );
        response.push(
          <div id={`${id}-ok`} className={`message feedbackOk hidden watson-font`} >
              <span>Thanks for the feedback.</span> 
          </div>
        );
        response.push(
          <div id={`${id}-fail`} className={`message feedbackFail hidden watson-font`} >
              <span>Thanks for the feedback.<br/>System failed to update the feedback!</span> 
          </div>
        );
        response.push(
          <div id={`${id}-comment-form`} className={`message feedbackCommentForm hidden watson-font`} >
              <textarea id={`${id}-comment-field`} className="feedback-comment-field" rows="2" placeholder="Enter Your Comment Here..."></textarea>
              <button class="feedback-button" type="button" onClick={()=> {this.clearCommentForm(`${id}`)}} >
                Cancel
              </button>
              <button class="feedback-button" type="button" 
                onClick={() => { this.sendFeedback(`${id}`, "commentForm"); }}>
                Submit
              </button>
          </div>
        );
    }

    if (typing) {
      response.push(
        <div key={response.length} className='message watson-message watson-font'>
          <div class='typing-dot'>
          </div><div class='typing-dot'>
          </div><div class='typing-dot'>
          </div>
        </div>
      );
    }

    // Legacy options buttons
    if (legacyOptions && currentIndex >= content.length && Array.isArray(options)) {
      response.push(...options.map((option, index) => (
        <div 
          key={response.length + index} className={`message message-option watson-font`} 
          onClick={() => { sendMessage(option); }}
        >
          {option}
        </div>
      )));
    }

    return <div>
      {response}
    </div>;
  }
}
