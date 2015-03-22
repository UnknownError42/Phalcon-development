<?php
namespace Application\Modules\Rest\Exceptions;

use \Phalcon\Http\Response\Exception;

/**
 * Class NotAcceptableException. Represents an HTTP 406 error.
 * The resource identified by the request is only capable of generating response entities
 * which have content characteristics not acceptable according to the accept headers sent in the request.
 *
 * @package Application\Modules\Rest
 * @subpackage    Exceptions
 * @since PHP >=5.4
 * @version 1.0
 * @author Stanislav WEB | Lugansk <stanisov@gmail.com>
 * @filesource /Application/Modules/Rest/Exceptions/NotAcceptableException.php
 */
class NotAcceptableException extends Exception {

    /**
     * @const HTTP response message
     */
    const MESSAGE = 'Not Acceptable';

    /**
     * @const HTTP response code
     */
    const CODE = 406;

    /**
     * Constructor
     *
     * @param string $message If no message is given 'Not Acceptable' will be the message
     * @param int $code Status code, defaults to 406
     */
    public function __construct($message = null, $code = null) {
        if(is_null($message) === true && is_null($code) === true) {
            parent::__construct(self::MESSAGE, self::CODE);
        }
        else {
            parent::__construct($message, $code);
        }
    }
}