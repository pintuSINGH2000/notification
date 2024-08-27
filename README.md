# Accessing and Using the Deployed Application
# Deployed Application URL
The notification backend application is live and accessible at the following URL:

https://notification-dhdb.onrender.com/api/v1/

# API Documentation
1. User Registration
   Endpoint: auth/register   
   Method: POST     
   Request body:  
      {   
   
         "name": "Your name",  
         "email": "your Email",  
         "password": "securepassword"
     
     }    
     
   Response:   
     201 Created   
      {
   
       "message": "Register Successfully"
     
     }    
2. User Login   
   Endpoint: auth/login   
   Method: POST   
   Request body:      
   {
    
         "email": "your Email",        
         "password": "securepassword"
     
   }       
   Response:   
      200 ok   
      {

         "message": "Login successfully",   
         "token": "jwt-token",   
         "userId": "your id"   
         
      }   
3. Subscribe to Notifications   
   Endpoint: notification/subscribe   
   Method: POST   
   Authorization: token in the Authorization header is required.   
   Request Body:   
      {
      
       "notificationType":"EMAIL" ["EMAIL","SMS","PUSH"]
          
      }      
   Response:   
    200 ok   
      {
      
       "message": "Subscription added successfully",   
       "subscription": {   
         "id": "subscription id",   
         "userId": "your id",   
         "type": "EMAIL",   
         "createdAt": date
       }
        
     }   
  400 Bad Request: If the notificationType is missing in the request body.   
     {  
     
        "error": "Missing required fields"
         
    }   
  401 Unauthorized: If the Authorization header is missing or invalid.   
     {   
     
         "error": "Unauthorized access"   
           
     }   
  500 Internal Server Error: If there is an issue with processing the subscription.   
    {   
       
        "error": "Error adding subscription",   
        "details": "Detailed error message"   
        
    }   
  
4. Send Notifications(This will send message to all subscribed user)   
   Endpoint: notification/send-notification   
   Method: POST    
   Request Body:   
     {   
     
        "message": "Welcome to our service!",   
        
     }   
   Response:   
    200 OK   
      {   
      
        "message": "Notifications enqueued for all subscribed users"   
          
      }   
    500 Internal Server Error   
      {   
      
        "error": "Error sending notifications",   
        "details": "Detailed error message"   
          
      }
