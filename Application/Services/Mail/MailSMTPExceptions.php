<?php
namespace Application\Services\Mail;

use Application\Modules\Rest\Exceptions\UnprocessableEntityException;

/**
 * Class MailSMTPExceptions. SMTP Mailer exception handler
 *
 * @package Application\Services
 * @subpackage Mail
 * @since PHP >=5.6
 * @version 1.0
 * @author Stanislav WEB | Lugansk <stanisov@gmail.com>
 * @copyright Stanislav WEB
 * @filesource /Application/Services/Mail/MailSMTPExceptions.php
 */
class MailSMTPExceptions
    implements \Swift_Events_TransportExceptionListener {

    /**
     * Invoked as a TransportException is thrown in the Transport system.
     *
     * @param \Swift_Events_TransportExceptionEvent $evt
     * @throws \Swift_TransportException
     */
    public function exceptionThrown(\Swift_Events_TransportExceptionEvent $evt)
    {

        $evt->cancelBubble(true);

        try{

            throw $evt->getException();
        }
        catch(\Swift_TransportException $e) {

            throw new UnprocessableEntityException([], $e->getMessage(), $e->getCode());
        }
    }
}