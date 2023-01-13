var TAG_DRAFT_NAME = '';
var CREATE_COUNT = 0;

function main() {
  var sp = PropertiesService.getScriptProperties();
  TAG_DRAFT_NAME = sp.getProperty('TAG_DRAFT');
  CREATE_COUNT = sp.getProperty('CREATE_COUNT');

  updateDraft();
}

/** タグ付きの下書きを複製する */
function updateDraft() {
  var drafts = GmailApp.getDrafts();

  // タグ付きのメールを残しつつ、他は削除する
  drafts.forEach(item => {
    var message = item.getMessage();
    // タグ付きではないので削除する
    if (!message.getSubject().includes(TAG_DRAFT_NAME)) {
      item.deleteDraft();
      return;
    }
  });

  // タグ付きしか残ってないので、ベースとなるメールを取得
  drafts = GmailApp.getDrafts();
  drafts.forEach(item => {
    for (var i = 0; i < CREATE_COUNT; i++) {
      var message = item.getMessage();
      var recipient = message.getTo();
      var subject = message.getSubject().replace(TAG_DRAFT_NAME, '');
      var body = message.getBody();
      var htmlBody = body.replace(/\n/g, '<br>');
      var options = { htmlBody: htmlBody };
      GmailApp.createDraft(recipient, subject, body, options);
    }
  });
}

/** 下書きの確認 */
function checkDraft() {
  var drafts = GmailApp.getDrafts();
  drafts.forEach(item => {
    var message = item.getMessage();
    Logger.log("=============================================");
    Logger.log(message.getBody());
    Logger.log(message.getSubject());
    Logger.log(message.getId());
    Logger.log("=============================================");
  });
}

/** タグ付きの下書きを取得する */
function getTaggedDraft() {
  var draftMessageArray = [];
  var drafts = GmailApp.getDrafts();

  drafts.forEach(item => {
    var message = item.getMessage();
    if (!message.getSubject().includes(TAG_DRAFT_NAME)) {
      return;
    }

    draftMessageArray.push(message);

    Logger.log("=============================================");
    Logger.log(message.getBody());
    Logger.log(message.getSubject());
    Logger.log(message.getId());
    Logger.log(message.getFrom());
    Logger.log(message.getTo());
    Logger.log("=============================================");
  });
  return draftMessageArray;
}
