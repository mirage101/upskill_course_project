# Upskill course project
Notify me when back in stock task<br>
Description
1. A button to subscribe for back in stock notification is displayed
on PDP for out-of-stock products.
2. When clicking on the button a modal dialog with form and title
should be displayed. The form:
2.1. Contains configurable title, input field for phone number, hidden
field for product id and submit button.
2.2. Validates the phone number on submit.
2.3. Submit the data to 'Twilio-Subscribe' controller via Ajax.
2.4. Handle success/failure response by displaying the appropriate
message.
3. After submitting the form, the data is stored in Salesforce
Commerce Cloud:
3.1. Custom object will be created for the product id passed in case
such does not exists.
3.2. Phone number will be added in the comma separated value string in
existing custom object if there are already subscriptions made for
that product.
4. Job configuration is made for a recurring process to send SMS to
subscribers and the message is sent when a product is back in stock.
5. Twilio REST API Service is configured and running.
