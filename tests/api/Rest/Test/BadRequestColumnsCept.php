<?php
$scenario = (null !== $scenario) ? $scenario : new \StdClass();

$I = new ApiTester($scenario);

$I->wantTo('GET 400 Bad Request: /api/v1/pages?columns=id,title,wrong');

$I->setHeader('Accept', '*/*');
$I->setHeader('Accept-Language', 'en-GB');

$I->sendGET('/api/v1/pages?columns=id,title,wrong');
$I->seeResponseCodeIs(400);
$I->seeResponseIsJson();
$I->seeResponseJsonMatchesJsonPath('$.error');
