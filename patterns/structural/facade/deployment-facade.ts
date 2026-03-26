const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class VersionControlSystem {
  async pullLatestChanges(branch: string): Promise<void> {
    console.log("VCS: Pulling latest changes from '" + branch + "'...");
    await delay(2000); // Simulate time taken to pull changes
    console.log("VCS: Pull complete.");
  }
}

class BuildSystem {
  async compileProject(): Promise<boolean> {
    console.log("BuildSystem: Compiling project...");
    await delay(2000); // Simulate time taken to compile
    console.log("BuildSystem: Build successful.");
    return true;
  }

  getArtifactPath(): string {
    const path = "target/myapplication-1.0.jar";
    console.log("BuildSystem: Artifact located at " + path);
    return path;
  }
}

class TestingFramework {
  async runUnitTests(): Promise<boolean> {
    console.log("Testing: Running unit tests...");
    await delay(1000);
    console.log("Testing: Unit tests passed.");
    return true;
  }

  async runIntegrationTests(): Promise<boolean> {
    console.log("Testing: Running integration tests...");
    await delay(1000);
    console.log("Testing: Integration tests passed.");
    return true;
  }
}

class DeploymentTarget {
  async transferArtifact(artifactPath: string, server: string): Promise<void> {
    console.log("Deployment: Transferring " + artifactPath + " to " + server + "...");
    await delay(2000);
    console.log("Deployment: Transfer complete.");
  }

  async activateNewVersion(server: string): Promise<void> {
    console.log("Deployment: Activating new version on " + server + "...");
    await delay(2000);
    console.log("Deployment: Now live on " + server + "!");
  }
}

// class DeploymentClient {
//   public static main(): void {
//     const branch: string = "main";
//     const prodServer: string = "prod.server.example.com";

//     // Client must create and manage all subsystems
//     const vcs = new VersionControlSystem();
//     const buildSystem = new BuildSystem();
//     const testFramework = new TestingFramework();
//     const deployTarget = new DeploymentTarget();

//     console.log(`\n[Client] Starting deployment for branch: ${branch}`);

//     // Step 1: Pull latest code
//     vcs.pullLatestChanges(branch);

//     // Step 2: Build the project
//     if (!buildSystem.compileProject()) {
//       console.error("[Client] Build failed. Deployment aborted.");
//       return;
//     }
//     const artifact: string = buildSystem.getArtifactPath();

//     // Step 3: Run tests
//     if (!testFramework.runUnitTests()) {
//       console.error("[Client] Unit tests failed. Deployment aborted.");
//       return;
//     }
//     if (!testFramework.runIntegrationTests()) {
//       console.error("[Client] Integration tests failed. Deployment aborted.");
//       return;
//     }

//     // Step 4: Deploy to production
//     await deployTarget.transferArtifact(artifact, prodServer);
//     await deployTarget.activateNewVersion(prodServer);

//     console.log("[Client] Deployment successful!");
//   }
// }


// Facade class that simplifies the deployment process for the client
class DeploymentFacade {
  private vcs = new VersionControlSystem();
  private buildSystem = new BuildSystem();
  private testingFramework = new TestingFramework();
  private deploymentTarget = new DeploymentTarget();

  async deployApplication(branch: string, serverAddress: string): Promise<boolean> {
    console.log("\nFACADE: --- Initiating FULL DEPLOYMENT for branch: " + branch + " to " + serverAddress + " ---");
    let success = true;

    try {
      await this.vcs.pullLatestChanges(branch);

      if (!await this.buildSystem.compileProject()) {
        console.error("FACADE: DEPLOYMENT FAILED - Build compilation failed.");
        return false;
      }

      const artifactPath = this.buildSystem.getArtifactPath();

      if (!await this.testingFramework.runUnitTests()) {
        console.error("FACADE: DEPLOYMENT FAILED - Unit tests failed.");
        return false;
      }

      if (!await this.testingFramework.runIntegrationTests()) {
        console.error("FACADE: DEPLOYMENT FAILED - Integration tests failed.");
        return false;
      }

      await this.deploymentTarget.transferArtifact(artifactPath, serverAddress);
      await this.deploymentTarget.activateNewVersion(serverAddress);

      console.log("FACADE: APPLICATION DEPLOYED SUCCESSFULLY to " + serverAddress + "!");
    } catch (e) {
      console.error("FACADE: DEPLOYMENT FAILED - An unexpected error occurred: " + (e as Error).message);
      console.error(e);
      success = false;
    }

    return success;
  }
}


class DeploymentAppFacade {
  static async main(): Promise<void> {
    const deploymentFacade = new DeploymentFacade();

    // Deploy to production
    await deploymentFacade.deployApplication("main", "prod.server.example.com");

    // Deploy a feature branch to staging
    console.log("\n--- Deploying feature branch to staging ---");
    await deploymentFacade.deployApplication("feature/new-ui", "staging.server.example.com");
  }
}

DeploymentAppFacade.main().catch(e => console.error("Unexpected error in deployment application: " + (e as Error).message));