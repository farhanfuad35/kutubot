# kutubot
Kutu Bot is a littol boi who grabs academic mails, google classroom notifications from my inbox and post them to our department Facebook group. He is dead now in real life. But may his soul lives forever in this repository.

### How does Kutu Bot works?
First I had to ensure that whatever notification/message I wanted to forward to Facebook must be sent to my Gmail mailbox first. Then I would 'label' particular emails through Gmail's smart filter. Therefore, only mails from particular addresses (teachers' mail & classroom mail) & with particular criterias (to avoid personal mails being lablled) would get labelled as 'kutubot'.
The next step is checking continuously for emails with label "kutubot". Thanks to google script for allowing this for free. I ran this particualr script on their server with 1 minute interval. So every 1 minute this script would look for new emails labelled "kutubot". If found, it would do some fancy formatting and then post the mail through Facebook's API **v8.0**.

### Why is kutubot dead?
Well, after working good for 3/4 days, one fine morning, two posts get marked as spam by Facebook. It was reasonable because both were classroom mails and they were fairly similar in structure. Later in the evening the posting Account gets deactivated by Facebook on accusation of posting spams.
