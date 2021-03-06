<?php
namespace Application\Modules\Rest\Services;

use \Phalcon\Logger;
use HttpStatuses\HttpStatuses;

/**
 * Class RestService. Http Rest handler
 *
 * @package Application\Modules\Rest
 * @subpackage Services
 * @since PHP >=5.6
 * @version 1.0
 * @author Stanislav WEB | Lugansk <stanisov@gmail.com>
 * @copyright Stanislav WEB
 * @filesource /Application/Modules/Rest/Services/RestExceptionHandler.php
 */
class RestExceptionHandler {

    /**
     * Dependency Container
     *
     * @var \Phalcon\Di\FactoryDefault $di
     */
    private $di;

    /**
     * Exception data
     *
     * @var \Exception $exception
     */
    private $exception;

    /**
     * Init DI
     *
     * @param \Phalcon\Di\FactoryDefault $di
     */
    public function __construct(\Phalcon\Di\FactoryDefault $di) {
        $this->setDi($di);
    }

    /**
     * Get Dependency container
     *
     * @return \Phalcon\Di\FactoryDefault
     */
    private function getDi()
    {
        return $this->di;
    }

    /**
     * Set dependency container
     *
     * @param \Phalcon\Di\FactoryDefault $di
     * @return RestExceptionHandler
     */
    private function setDi(\Phalcon\DiInterface $di)
    {
        $this->di = $di;
        return $this;
    }

    /**
     * Handle exception data
     *
     * @param \Exception $data
     */
    public function handle(\Exception $exception) {

        $this->setException($exception);

        return $this;
    }

    /**
     * Get request service
     *
     * @return \Phalcon\Http\Request
     */
    private function getRequest() {
        return $this->getDi()->get('request');
    }

    /**
     * Get response service
     *
     * @return \Phalcon\Http\Response
     */
    private function getResponse() {
        return $this->getDi()->get('response');
    }

    /**
     * Get log mapper
     *
     * @return \Application\Services\Mappers\LogMapper
     */
    private function getLogMapper() {
        return $this->getDi()->get('LogMapper');
    }

    /**
     * Get ErrorMapper
     *
     * @return \Application\Services\Mappers\ErrorMapper
     */
    private function getErrorMapper() {
        return $this->getDi()->get('ErrorMapper');
    }

    /**
     * Get exception data
     * @return array
     */
    private function getException() {
        return $this->exception;
    }

    /**
     * Set exception data
     *
     * @param \Exception $exception
     */
    private function setException(\Exception $exception) {

        // set exception code
        $this->exception['code'] = $exception->getCode();

        // set resource
        $this->exception['resource'] = $this->getResource();

        if($this->isJson($exception->getMessage())) {

            $exception = json_decode($exception->getMessage(), true);
            $this->exception['message'] = $exception['data']['message'];

            if(isset($exception['data']) === true) {

                unset($exception['data']['message']);
                $code = key($exception['data']);

                $this->exception['data'] = $exception['data'];

                if(is_numeric($code) === false) {
                    $error = $this->getErrorMapper()->getError($code);
                    $this->exception['data']['developer'] = $this->getDeveloperLink($error);
                    $this->exception['info'] =  $this->getErrorInfo($this->exception['code']);
                }
            }
        }
        else
        {
            $this->exception['message'] = $exception->getMessage();
        }

        $this->logMessage();
    }

    /**
     * Check if message has a json format
     *
     * @param $string
     * @return bool
     */
    private function isJson($string) {
        return ((is_string($string) &&
            (is_object(json_decode($string)) ||
                is_array(json_decode($string))))) ? true : false;
    }

    /**
     * Get current URI
     *
     * @return string
     */
    private function getResource() {
        return $this->getRequest()->getScheme().'://'.$this->getRequest()->getHttpHost().$this->getRequest()->getURI();
    }

    /**
     * Get developer info link
     *
     * @param $error
     * @return string|null
     */
    private function getDeveloperLink($error) {

        if(!empty($error)) {
            return $this->getRequest()->getScheme().'://'.$this->getRequest()->getHttpHost().'/api/v1/errors/'.$error->id;
        }

        return null;
    }

    /**
     * Get http status additional info
     *
     * @param int $code
     *
     * @return array
     */
    private function getErrorInfo($code) {

        $http = new HttpStatuses();
        return $http->getStatus($code);

    }

    /**
     * Send response with error message
     */
    public function send() {

        $e = $this->getException();

        $this->getResponse()->setContentType('application/json', 'utf-8')
            ->setStatusCode($e['code'], $e['message'])
            ->setJsonContent(['error' => $e])->send();
    }

    /**
     * Log exceptions
     */
    public function logMessage() {

        if($this->getException()['code'] != 500) {

            $message = [
                'exception' => $this->getException()['message']. ' : ' .$this->getException()['code'],
                'ip' => $this->getRequest()->getClientAddress(),
                'refer' => $this->getRequest()->getHTTPReferer(),
                'method' => $this->getRequest()->getMethod(),
                'uri' => $this->getException()['resource'],
            ];

            if(isset($this->getException()['data']) === true) {
                  $message['message'] = urldecode(http_build_query($this->getException()['data']));
            }
            $this->getLogMapper()->save($message, Logger::ALERT);
        }
    }
}