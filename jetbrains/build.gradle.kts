import org.jetbrains.intellij.platform.gradle.TestFrameworkType

plugins {
    id("org.jetbrains.kotlin.jvm")
    id("org.jetbrains.intellij.platform")
}

group = "com.github.learnergeekperfectionist.coderef"
version = providers.gradleProperty("pluginVersion").get()

kotlin {
    jvmToolchain(21)
}

dependencies {
    testImplementation("junit:junit:4.13.2")

    intellijPlatform {
        local(providers.gradleProperty("platformLocalPath").get())
        testFramework(TestFrameworkType.Platform)
    }
}

intellijPlatform {
    pluginConfiguration {
        id = "com.github.learnergeekperfectionist.coderef.jetbrains"
        name = "Code Ref"
        version = providers.gradleProperty("pluginVersion")
        description = "Copy selected editor text as absolute-path code references."

        ideaVersion {
            sinceBuild = providers.gradleProperty("pluginSinceBuild")
            untilBuild = providers.gradleProperty("pluginUntilBuild")
        }

        vendor {
            name = "Learner-Geek-Perfectionist"
            url = "https://github.com/Learner-Geek-Perfectionist/code-ref"
        }
    }
}
