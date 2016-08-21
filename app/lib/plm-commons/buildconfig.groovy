sys{
    catalinaHome = utils.pick(System.getProperty( "catalinaHome"), System.env.CATALINA_HOME)
    catalinaHomeWebAppName = System.getProperty( "catalinaHomeWebAppName", "ROOT")
    javaHome = utils.pick(System.getProperty( "javaHome"), System.env.JAVA_HOME)
}

gradle{
    version= "2.5"
}

release{
    group = utils.pick(System.getProperty( "buildGroup"), System.env.BUILD_GROUP, "com.autodesk.plm")
    //version = utils.pick(System.getProperty( "buildVersion"), System.env.BUILD_VERSION, "0.0.2-SNAPSHOT")
    versionInfo{ //used as version info file within war file
        sourceUrl = utils.pick(System.getProperty( "sourceUrl"), System.env.SOURCE_URL, "NOT_SET")
        sourceBranch = utils.pick(System.getProperty( "sourceBranch"), System.env.SOURCE_BRANCH, "NOT_SET")
        sourceRevision = utils.pick(System.getProperty( "sourceRevision"), System.env.SOURCE_REV, "NOT_SET")
    }
}
