// Note: Shabbir Sir's mail is filtered if 1) To has many students or 2) My Address is in "Bcc", not "To" & his address is in "To". It is assumed that any personal message meant for me would have my email address in "To"

//###--###
const lineBreak = "\n-----------------------------------------------\n";
const defaultURL = "https://graph.facebook.com/v8.0/{goup-id}/";
// Kutu Bot Access Token
const access_token = "{access-token}"

function processEmails() {
  //###--###
  var label = GmailApp.getUserLabelByName("kutubot");
  var threads = label.getThreads();
  var message;
  var attachment;  
  
  for (var i = threads.length - 1; i >= 0; i--) {
    //###--###
    threads[i].removeLabel(label).refresh();
    
    var cnt = threads[i].getMessageCount();
    var mail = threads[i].getMessages()[cnt-1];
    
    
    // Check if it is from classroom. If yes, then only extract
    var fromAddress = mail.getFrom();
    if(fromAddress.includes("@classroom.google.com")){
      message = extractClassroomMessage(mail.getPlainBody());
    }
    else if(fromAddress.includes({mail-address-of-shabbir-sir})){
      message = extractShabbirSirMail(mail.getPlainBody());
      message = "New email from " + fromAddress + lineBreak + message;
    }
    else{
      message = mail.getPlainBody();
      message = "New email from " + fromAddress + lineBreak + message;
    }
    
    Logger.log(message);
    
    if(message != "!~3RR0R~!"){
      message = message + lineBreak + "To unsubscribe, blocking me should work. Sincerely, Kutu Bot.";
      
      // ###--###
      // Send mail to Fairuza & Shamim for post confirmation
      var body = "Fairuza, the message below has been posted to Facebook.";
      var fairuza = body + lineBreak + message + lineBreak;
      body = "Bin Zahid, the following message has been posted to Facebook.";
      var shamim = body + lineBreak + message + lineBreak;
      GmailApp.sendEmail({mailAddressOfFairuza}, "Message has been posted to Facebook", fairuza);
      GmailApp.sendEmail({mailAddressOfBinZahid}, "Message has been posted to Facebook", shamim);
      
      // Check for attachments
      var attachments = mail.getAttachments();
      if(attachments.length == 0){
        Logger.log("The mail has no attachment");
        postWithoutAttachment(message);
      }
      // Has Attachments
      else{
        var imageAttachments = new Array();
        var otherAttachments = new Array();
        for(var j=0; j<attachments.length; j++){
          if(attachments[j].getContentType().includes("image")){
            imageAttachments.push(attachments[j].copyBlob());
          }
          else{
            otherAttachments.push(attachments[j].copyBlob());
          }
        }
        
        if(otherAttachments.length == 0){
          postImageAttachments(imageAttachments, message);
        }
        else{
          //postOtherAttachments(otherAttachments, message);
          postWithoutAttachment("### THIS EMAIL CONTAINS ATTACHMENTS ###\n\n"+message);
        }
      }
    }
  }
}

function postImageAttachments(imageAttachments, message){
  var URL = defaultURL + "photos";
  var encodedURL = encodeURI(URL);
  var attached_media = new Array();
  for(var i=0;i<imageAttachments.length; i++){  
    var data = {
      caption:"Attachment #" + i,
      published:false,
      access_token:access_token,
      source:imageAttachments[i],
    }
    
    try{
      response = UrlFetchApp.fetch(encodedURL, {
        method: "POST",
        payload: data
      });
      
      responseParsed = JSON.parse(response);
      attached_media[i] = {"media_fbid":responseParsed.id};
      
    }catch(error) {
      Logger.log("Uploading unpublished photo failed: " + error);
    };
    
  }
  
  // Now publish the photos
  
  URL = defaultURL + "feed";
  encodedURL = encodeURI(URL);
  
  var data = {
    message:message,
    access_token:access_token,
    "attached_media": JSON.stringify(attached_media),
  };  
  
  try{
    response = UrlFetchApp.fetch(encodedURL, {
      method: "POST",
      payload: data
    });
    
    Logger.log(response);
    
  }catch(error) {
    Logger.log(error);
  };
  
}

function postOtherAttachments(otherAttachments, message){
  // Facebook doesn't allow file attachment through API yet.
}

function postWithoutAttachment(message){
  var data = {
    message:message,
    access_token:access_token,
  };
  
  var URL = defaultURL+"feed";
  var encodedURL = encodeURI(URL);
  
  try{
    response = UrlFetchApp.fetch(encodedURL, {
      method: "POST",
      payload: data
    });
    
    Logger.log(response.getContentText());
  }catch(error) {
    Logger.log(error);
  };
}

function extractClassroomMessage(mail){  
  var message = mail.match(/Hi Farhan Fuad,([^]*)<[^>]*>.([^]*)OPEN[^<]*<([^>]*)>/);
  if(message == null || message[0] == null || message[1] == null || message[2] == null || message[3] == null){
    Logger.log("Contains Null String");
    return "!~3RR0R~!";
  }
  else{
    return message[1] + message[2] + "\n\nOriginal Classroom Link: " + message[3];
  }
}

function extractShabbirSirMail(mail){
  if(mail.includes("Shabbir Ahmed is inviting you to a scheduled BdREN Zoom meeting.")){
    message = mail.match(/Shabbir Ahmed is inviting you to a scheduled BdREN Zoom meeting.[^]*?Password: \d+/);
    return message[0];
  }
  else{
    return mail;
  }
}
