import forge from "node-forge";
import axios, { AxiosResponse } from "axios";
import IDGenerator from "./utils/IDGenerator";
import packageJSON from "../package.json";

interface IAESDecrypt {
  iv: string;
  cipher: string;
}

interface IInit {
  apiKey: string;
  subscriptionKey: string;
  secret: string;
  APIUrl?: string;
}

interface IInitResponse {
  tenantId: string;
  e2e: boolean;
  indicators: Array<string>;
}

type ProjectProps = {
  project: string;
  version: string;
};

class Commt {
  protected apiKey: string;
  protected subscriptionKey: string;
  protected secretKey: string;
  protected APIUrl: string = "https://service.commt.co";

  indicators: Array<string> = [];
  tenantId: string = "";
  e2e: boolean = false;

  constructor(keys: IInit) {
    this.secretKey = keys.secret;
    this.apiKey = keys.apiKey;
    this.subscriptionKey = keys.subscriptionKey;
    this.APIUrl = keys.APIUrl ?? this.APIUrl;
  }

  decrypt(props: IAESDecrypt) {
    const key = this.secretKey;
    const { iv, cipher } = props;
    const decipher = forge.cipher.createDecipher("AES-CBC", key);

    decipher.start({ iv: forge.util.createBuffer(forge.util.hexToBytes(iv)) });
    decipher.update(forge.util.createBuffer(forge.util.hexToBytes(cipher)));
    decipher.finish();
    // return decrypted data
    return decipher.output.toString();
  }

  createRoom(participants: Array<string>): string {
    const data = {
      participants,
      tenantId: this.tenantId,
      chatRoomAuthId: IDGenerator({ longId: false }),
    };
    axios.post(`${this.APIUrl}/api/v1/room`, data, {
      headers: { apiKey: this.apiKey, subscriptionKey: this.subscriptionKey },
    });

    return data.chatRoomAuthId;
  }
}

class CommtFactory {
  protected static APIUrl: string = "https://service.commt.co";
  protected static project: ProjectProps = {
    project: "NodeJS SDK",
    version: packageJSON.version,
  };
  protected static commt: Commt;

  protected static async request(
    apiKey: string,
    subscriptionKey: string
  ): Promise<IInitResponse> {
    const queryParams = new URLSearchParams(this.project);

    return Promise.resolve(
      axios.get(`${this.APIUrl}/api/v1/tenant/config?${queryParams}`, {
        headers: {
          apiKey,
          subscriptionKey,
        },
      })
    )
      .then((data: AxiosResponse<IInitResponse>) => {
        if (data && data.data.tenantId) {
          return data.data;
        } else {
          // TODO: Log error
          return { msg: "Tenant init data incorrect!" };
        }
      })
      .catch((error) => {
        // TODO: Log error
        return error;
      });
  }

  static init(config: IInit) {
    this.commt = new Commt(config);
    this.APIUrl = config.APIUrl ?? this.APIUrl;

    this.request(config.apiKey, config.subscriptionKey).then((response) => {
      this.commt.indicators = response.indicators;
      this.commt.tenantId = response.tenantId;
      this.commt.e2e = response.e2e;
    });
  }

  static with(): Commt {
    return this.commt;
  }
}

export { CommtFactory as Commt, IDGenerator };
