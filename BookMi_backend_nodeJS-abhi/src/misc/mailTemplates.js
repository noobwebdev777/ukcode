let mailTemplates = new Object();
const moment = require('moment');

mailTemplates.forgotPasswordTemplate = async (resetUrl) => {
    console.log(resetUrl);
    return `
    <tbody>       
        <tr>
         <td valign="top">
          <table style="border-left: 1px solid rgba(249, 249, 249, 1); border-right: 1px solid rgba(249, 249, 249, 1)" width="100%" cellspacing="0" cellpadding="0" border="0">
           <tbody><tr>
            <td style="background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial; background-color: rgba(255, 255, 255, 1)" valign="top">
             <div style="padding: 40px 0 0">
              <div style="padding-left: 25px; padding-right: 25px">
               <table style="width: 100%" cellspacing="0" cellpadding="0" border="0">
                <tbody><tr>
                 <td style="padding-bottom: 40px; padding-top: 8px">
                  <h1 style="font-size: 25px; font-weight: bold; line-height: 1.5; margin: 0; text-align: center">
                   We’ve received a request to change your password on BookMi.
                  </h1>
                 </td>
                </tr>
               </tbody></table>
               <table style="width: 100%" cellspacing="0" cellpadding="0" border="0">
                <tbody><tr>
                 <td style="padding-bottom: 32px">
                  If you did not request a password change, please ignore this message. Your current password will remain valid.
                 </td>
                </tr>
                <tr>
                 <td style="padding-bottom: 32px">
                  To reset your password, click the button below:
                 </td>
                </tr>
               </tbody></table>
               <table style="width: 100%" cellspacing="0" cellpadding="0" border="0">
                <tbody>
                 <tr>
                  <td align="center">
                   <table style="background-color: rgba(10, 162, 172, 1); border-radius: 8px; font-weight: bold; width: auto" cellspacing="0" cellpadding="0" border="0">
                    <tbody>
                     <tr>
                      <td valign="top" align="center">
                       <a href="${resetUrl}" style="color: inherit; text-decoration: none" title="">
                        <table cellspacing="0" cellpadding="0" border="0">
                         <tbody><tr>
                          <td style="border-radius: 8px; color: rgba(255, 255, 255, 1); font-weight: bold; padding: 12px 32px; text-decoration: none; white-space: nowrap">
                           Reset password
                          </td>
                         </tr>
                        </tbody></table>
                       </a>
                      </td>
                     </tr>
                    </tbody>
                   </table>
                  </td>
                 </tr>
                </tbody>
               </table>
              </div>
              <br>
              <table style="background-color: rgba(233, 233, 233, 1); font-weight: bold; padding: 16px; text-align: center; text-transform: uppercase; width: 100%" cellspacing="0" cellpadding="0" border="0">
               <tbody><tr>
                <td>
                 <a href="#ref" style="color: rgba(109, 110, 114, 1); text-decoration: none">
                  Let’s book!
                 </a>
                </td>
               </tr>
              </tbody></table>
             </div>
            </td>
           </tr>
           <tr>
            <td style="background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial; background-color: rgba(243, 243, 243, 1); height: 1px" valign="top">
            </td>
           </tr>
          </tbody></table>
         </td>
        </tr>
       </tbody>
    `
}

mailTemplates.bookingTemplate = async (data) => {
    let tz = data.timezone || 'Asia/Kolkata'
    let time = new Date(data.services[0].start).toLocaleString(undefined, { timeZone: tz })
    return `
        <p>Hello, 
        <br />Greetings from BookMi</p>
        <p>Your booking is confirmed for the ${data.services[0]?.serviceDetails.name} at ${data.businessDetails.businessName}</p>
        <p>Here's the details on the same:</p>
        <p>Booking ID : ${data.bookingId}
        <br />Date : ${moment(data.services[0].start).format("DD/MM/YYYY")}
        <br />Time : ${time ? time.split(',')[1] : ''}
        </p>
        <p>&nbsp;</p>
        <p>Team BookMi</p>
        `
}


{/* <br />Time : ${moment(data.services[0].start).format("hh:mm")} */}

module.exports = mailTemplates;