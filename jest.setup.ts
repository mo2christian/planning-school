import { GenericContainer, StartedTestContainer } from 'testcontainers';
import NodeEnvironment from 'jest-environment-node';
import type { Config } from '@jest/types';

let mongo: StartedTestContainer;
let zipkin: StartedTestContainer;

class CustomTestEnvironment extends NodeEnvironment {

    constructor(config: Config.ProjectConfig) {
        super(config);
    }

    async setup(){
        await super.setup(); 
        mongo = await new GenericContainer("mongo:4.4.10")
            .withExposedPorts(27017)
            .start(); 
        this.global.MONGO_URL = mongo.getHost() + ":" + mongo.getMappedPort(27017) + "/web";
        zipkin = await new GenericContainer("openzipkin/zipkin:2.23")
            .withExposedPorts(9411)
            .start();
        this.global.ZIPKIN_URL  = zipkin.getHost() + ":" + zipkin.getMappedPort(9411);
    }

    async teardown(){
        await super.teardown();
        mongo.stop();
        zipkin.stop();
    }

    getVmContext() {
        return super.getVmContext();
    }

}

module.exports = CustomTestEnvironment