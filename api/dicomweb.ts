/**
 * DICOMweb Integration Module
 * Provides DICOMweb (WADO-RS, STOW-RS, QIDO-RS) support for radiology templates
 */

export interface DicomWebConfig {
  baseUrl: string;
  auth?: {
    type: 'bearer' | 'basic' | 'oauth2';
    token?: string;
    credentials?: {
      username: string;
      password: string;
    };
  };
  headers?: Record<string, string>;
}

export interface DicomStudyInstance {
  studyInstanceUID: string;
  patientName?: string;
  patientId?: string;
  studyDate?: string;
  modality?: string;
  description?: string;
}

export interface DicomSeriesInstance {
  seriesInstanceUID: string;
  seriesNumber?: number;
  modality?: string;
  description?: string;
  numberOfInstances?: number;
}

export interface DicomInstance {
  sopInstanceUID: string;
  sopClassUID?: string;
  instanceNumber?: number;
}

/**
 * QIDO-RS: Query DICOMweb - Search for studies/series/instances
 */
export class DicomWebQido {
  constructor(private config: DicomWebConfig) {}

  /**
   * Search for studies matching query parameters
   */
  async searchStudies(params: {
    patientName?: string;
    patientId?: string;
    studyDate?: string;
    modality?: string;
    description?: string;
    limit?: number;
    offset?: number;
  }): Promise<DicomStudyInstance[]> {
    const queryParams = new URLSearchParams();
    
    if (params.patientName) queryParams.append('PatientName', params.patientName);
    if (params.patientId) queryParams.append('PatientID', params.patientId);
    if (params.studyDate) queryParams.append('StudyDate', params.studyDate);
    if (params.modality) queryParams.append('ModalitiesInStudy', params.modality);
    if (params.description) queryParams.append('StudyDescription', params.description);
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.offset) queryParams.append('offset', params.offset.toString());

    const url = `${this.config.baseUrl}/studies?${queryParams.toString()}`;
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`QIDO-RS failed: ${response.status}`);
      }
      
      return (await response.json()) as DicomStudyInstance[];
    } catch (error) {
      console.error('QIDO-RS search error:', error);
      throw error;
    }
  }

  /**
   * Search for series within a study
   */
  async searchSeries(studyInstanceUID: string, params?: {
    seriesNumber?: number;
    modality?: string;
  }): Promise<DicomSeriesInstance[]> {
    const queryParams = new URLSearchParams();
    
    if (params?.seriesNumber) queryParams.append('SeriesNumber', params.seriesNumber.toString());
    if (params?.modality) queryParams.append('Modality', params.modality);

    const url = `${this.config.baseUrl}/studies/${studyInstanceUID}/series?${queryParams.toString()}`;
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`QIDO-RS series search failed: ${response.status}`);
      }
      
      return (await response.json()) as DicomSeriesInstance[];
    } catch (error) {
      console.error('QIDO-RS series search error:', error);
      throw error;
    }
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Accept': 'application/dicom+json',
      ...this.config.headers
    };

    if (this.config.auth?.type === 'bearer' && this.config.auth.token) {
      headers['Authorization'] = `Bearer ${this.config.auth.token}`;
    }

    return headers;
  }
}

/**
 * STOW-RS: Store DICOMweb - Store DICOM instances
 */
export class DicomWebStow {
  constructor(private config: DicomWebConfig) {}

  /**
   * Store DICOM instances to the server
   */
  async storeInstances(studyInstanceUID: string, instances: DicomInstance[]): Promise<void> {
    const url = `${this.config.baseUrl}/studies/${studyInstanceUID}`;
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(instances)
      });
      
      if (!response.ok) {
        throw new Error(`STOW-RS store failed: ${response.status}`);
      }
    } catch (error) {
      console.error('STOW-RS store error:', error);
      throw error;
    }
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/dicom+json',
      'Accept': 'application/dicom+json',
      ...this.config.headers
    };

    if (this.config.auth?.type === 'bearer' && this.config.auth.token) {
      headers['Authorization'] = `Bearer ${this.config.auth.token}`;
    }

    return headers;
  }
}

/**
 * WADO-RS: Web Accessible DICOM Objects Retrieval
 */
export class DicomWebWado {
  constructor(private config: DicomWebConfig) {}

  /**
   * Retrieve DICOM instance as DICOM JSON
   */
  async retrieveInstance(
    studyInstanceUID: string,
    seriesInstanceUID: string,
    sopInstanceUID: string
  ): Promise<DicomInstance> {
    const url = `${this.config.baseUrl}/studies/${studyInstanceUID}/series/${seriesInstanceUID}/instances/${sopInstanceUID}`;
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`WADO-RS retrieve failed: ${response.status}`);
      }
      
      return (await response.json()) as DicomInstance;
    } catch (error) {
      console.error('WADO-RS retrieve error:', error);
      throw error;
    }
  }

  /**
   * Retrieve rendered image (JPEG/PNG)
   */
  async retrieveRenderedImage(
    studyInstanceUID: string,
    seriesInstanceUID: string,
    sopInstanceUID: string,
    contentType: 'image/jpeg' | 'image/png' = 'image/jpeg'
  ): Promise<Blob> {
    const url = `${this.config.baseUrl}/studies/${studyInstanceUID}/series/${seriesInstanceUID}/instances/${sopInstanceUID}/rendered`;
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': contentType,
          ...this.config.headers
        }
      });
      
      if (!response.ok) {
        throw new Error(`WADO-RS rendered image failed: ${response.status}`);
      }
      
      return await response.blob();
    } catch (error) {
      console.error('WADO-RS rendered image error:', error);
      throw error;
    }
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Accept': 'application/dicom+json',
      ...this.config.headers
    };

    if (this.config.auth?.type === 'bearer' && this.config.auth.token) {
      headers['Authorization'] = `Bearer ${this.config.auth.token}`;
    }

    return headers;
  }
}

/**
 * DICOMweb Service - Combined QIDO, STOW, and WADO operations
 */
export class DicomWebService {
  readonly qido: DicomWebQido;
  readonly stow: DicomWebStow;
  readonly wado: DicomWebWado;

  constructor(config: DicomWebConfig) {
    this.qido = new DicomWebQido(config);
    this.stow = new DicomWebStow(config);
    this.wado = new DicomWebWado(config);
  }

  /**
   * Check if DICOMweb endpoint is available
   */
  async isAvailable(): Promise<boolean> {
    try {
      const baseUrlPath = this.qido['config'].baseUrl.replace('/studies', '');
      const response = await fetch(baseUrlPath, {
        method: 'GET',
        headers: this.qido['config'].headers || {}
      });
      return response.ok;
    } catch {
      return false;
    }
  }
}

export default DicomWebService;
