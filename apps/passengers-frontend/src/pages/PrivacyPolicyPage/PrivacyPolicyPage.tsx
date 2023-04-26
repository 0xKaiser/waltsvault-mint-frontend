/* eslint-disable react/jsx-no-comment-textnodes */
import useBreakpoints from '@twl/common/hooks/useBreakpoints';
import IMG_PASSENGER_BADGE from 'assets/images/passengers/img_passenger_badge_3.png';
import BracketsHighlight from 'components/BracketsHighlight';
import ContentContainer from 'components/ContentContainer';
import ContentSeparator from 'components/ContentSeparator';
import PassengersSocialButtons from 'components/PassengersSocialButtons';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function TermsPage() {
  const navigate = useNavigate();
  const { isDesktop, isMobile } = useBreakpoints();

  // Removes global font scaling since it is not desired on this page....
  useEffect(() => {
    document.documentElement.style.fontSize = '100%';

    return () => {
      document.documentElement.style.fontSize = '';
    };
  }, []);

  function goHome() {
    navigate('/');
  }

  function renderTitle(title: string) {
    if (isMobile) return <h3>{title}</h3>;
    return <h2>{title}</h2>;
  }

  return (
    <div className="passengers text-white p-10">
      <div className="w-full flex justify-between pb-20">
        <button className="relative py-3 px-6" onClick={goHome} type="button">
          <p className="description">home</p>
          <BracketsHighlight size={12} />
        </button>
        <PassengersSocialButtons />
      </div>
      {!isDesktop && (
        <div className="w-full flex justify-center mb-12">
          <img className="min-h-[80px] min-w-[80px] animate-spin-slow" src={IMG_PASSENGER_BADGE} alt="spinning badge" />
        </div>
      )}
      <ContentContainer>
        {isDesktop && (
          <div className="absolute top-[0] right-[calc(100%+40px)]">
            <img
              className="min-h-[144px] min-w-[144px] animate-spin-slow"
              src={IMG_PASSENGER_BADGE}
              alt="spinning badge"
            />
          </div>
        )}
        {renderTitle('PRIVACY POLICY')}
        <ContentSeparator />

        <div className="mb-4 last:mb-0 description">Welcome to <a className='underline' href='https://passengers.space'>www.passengers.space</a> and thank you for your interest in our website and company. At Passengers, we take the protection of your Personal Data very seriously and process your data in accordance with the British Virgin Islands Data Protection Act (“DPA”) and the General Data Protection Regulation (“GDPR”).</div>

        <div className="mt-10 mb-4 caption uppercase">What is Personal Data?</div>
        <div className="mb-4 last:mb-0 description">Personal Data is information that makes it possible to identify a natural person. This includes, your name, date of birth, address, telephone number, e-mail address, but also your IP address. Anonymous data as such only exists if no personal reference to the user can be made.</div>

        <div className="mt-10 mb-4 caption uppercase">The Data Controller</div>
        <div className="mb-4 last:mb-0 description">In accordance with the DPA and the GDPR, the person responsible for processing of Personal Data when using our website and services is:</div>
        <div className="mb-4 last:mb-0 description">
          Passengers
          <br />
          ReDeploy Limited
          <br />
          Road Town, Tortola, VG 1110,
          <br />
          British Virgin Islands
        </div>
        <div className="mb-4 last:mb-0 description">
          Web: <a className='underline' href='https://passengers.space'>www.passengers.space</a>
          <br />
          E-Mail: <a className='underline' href='mailto:info@passengers.space'>info@passengers.space</a>
          <br />
           <a className='underline' href='https://twitter.com/Passengers_NFT'>Twitter</a>, <a className='underline' href='https://discord.com/invite/passengers'>Discord</a>
        </div>
        <div className="mb-4 last:mb-0 description">(hereinafter “Passengers”, “we”, “our” or “us”)</div>

        <div className="mt-10 mb-4 caption uppercase">Categories of data subjects and types of data processed</div>
        <div className="mb-4 last:mb-0 description">During the course of using our website and services, we process the following types of data from visitors and users: inventory data (e.g., names), contact data (e.g., e-mail), content data (e.g., messages), usage data (e.g., access time, and log files entry), and meta/communication data (e.g., device information, IP addresses).</div>

        <div className="mt-10 mb-4 caption uppercase">Purpose of the processing</div>
        <div className="mb-4 last:mb-0 description">The Purpose of processing Personal Data are the provision of the NFT and website, its functions and contents, responding to contact requests and communicating with users, security measures, and reach measurement/marketing.</div>

        <div className="mt-10 mb-4 caption uppercase">Relevant legal basis</div>
        <div className="mb-4 last:mb-0 description">
          In accordance with the DPA and the GDPR, the following legal basis, unless specifically described below apply to the processing of your Personal Data:
          <br/>
          &nbsp;&nbsp;•&nbsp;&nbsp;Consent: the individual has given clear consent to process Personal Data for a specific purpose.
          <br/>
          &nbsp;&nbsp;•&nbsp;&nbsp;Contract: the processing is necessary for a contract or because you have asked us to take specific steps before entering into a contract.
          <br/>
          &nbsp;&nbsp;•&nbsp;&nbsp;Legal obligation: the processing is necessary for us to comply with the law (not including contractual obligations).
          <br/>
          &nbsp;&nbsp;•&nbsp;&nbsp;Legitimate interests: the processing is necessary for our legitimate interests or the legitimate interests of a third party, unless there is a good reason to protect your Personal Data which overrides those legitimate interests.
        </div>

        <div className="mt-10 mb-4 caption uppercase">Security of your Personal Data</div>
        <div className="mb-4 last:mb-0 description">We take appropriate technical and organisational measures in order to ensure a level of protection appropriate to the risk. These measures include, in particular, ensuring the confidentiality, integrity and availability of data by controlling physical access to the data, as well as access to, input, disclosure, ensuring availability and segregation of the data. We also have procedures in place to ensure the exercise of data subjects rights, deletion of data and response to data compromise.</div>
        <div className="mb-4 last:mb-0 description">Furthermore, we already take the protection of Personal Data into account during the development and selection of hardware, software, and procedures, in accordance with the principle of data protection through technology design and through data protection-friendly default settings.</div>
        <div className="mb-4 last:mb-0 description">However, databases or data sets that include Personal Data may be breached inadvertently or through wrongful intrusion. Upon becoming aware of a data breach, we will notify all affected individuals whose Personal Data may have been compromised, and the notice will be accompanied by a description of action being taken to reconcile any damage as a result of the data breach. Notices will be provided as expeditiously as possible after which the breach was discovered.</div>

        <div className="mt-10 mb-4 caption uppercase">Your rights</div>
        <div className="mb-4 last:mb-0 description">You as the Data Subject are be entitled to rely on the following rights.</div>
        <div className="mb-4 last:mb-0 description">
          &nbsp;&nbsp;•&nbsp;&nbsp;Right of access
          <br/>
          &nbsp;&nbsp;•&nbsp;&nbsp;Right to rectification
          <br/>
          &nbsp;&nbsp;•&nbsp;&nbsp;Right to restriction of processing
          <br/>
          &nbsp;&nbsp;•&nbsp;&nbsp;Right to erasure
          <br/>
          &nbsp;&nbsp;•&nbsp;&nbsp;Right to information
          <br/>
          &nbsp;&nbsp;•&nbsp;&nbsp;Right to data portability
          <br/>
          &nbsp;&nbsp;•&nbsp;&nbsp;Right to object
          <br/>
          &nbsp;&nbsp;•&nbsp;&nbsp;Right of withdrawal
          <br/>
          &nbsp;&nbsp;•&nbsp;&nbsp;Right to complain to a supervisory authority
        </div>
        <div className="mb-4 last:mb-0 description">To assert these rights, please contact us at any time using info@passengers.space.</div>
        <div className="mb-4 last:mb-0 description">You also have the right to lodge a complaint with your local or any other data protection supervisory authority. The in the British Virgin Islands responsible data protection supervisory authority is the Office of the Information Commissioner. We would, however, appreciate the chance to deal with your concerns before you approach any other supervisory authority.</div>
        <div className="mb-4 last:mb-0 description">The above rights may be limited in some circumstances, for example, if fulfilling your request would reveal Personal Data about another person, if you ask us to delete information which we are required to have by law, or if we have compelling legitimate interests to keep it.</div>
        <div className="mb-4 last:mb-0 description">We will let you know if that is the case and will then only use your information for these purposes. You may also be unable to continue using our services if you want us to stop processing your Personal Data.</div>

        <div className="mt-10 mb-4 caption uppercase">Data processing on our website</div>
        <div className="mb-4 last:mb-0 description">In the following sections, we explain the individual data processed, the purposes of processing, the legal bases, recipients and, where applicable, transfers to third countries.</div>
        <div className="mt-8 mb-2 caption-small text-primary-blue uppercase">a) Hosting</div>
        <div className="mb-4 last:mb-0 description">The hosting services used by us for the purpose of operating our website is <a className='underline' href='https://aws.amazon.com/privacy/'>Amazon Web Services (AWS)</a>. In doing so AWS, processes inventory data, contact data, content data, usage data, meta data and communication data of customers, interested parties and visitors of our website and services, on the basis of our legitimate interests in an efficient and secure provision of the website and services in conjunction with the provision of contractual services and the conclusion of the contract for our services, including but not limited to our services).</div>
        <div className="mt-8 mb-2 caption-small text-primary-blue uppercase">b) Collection of access data and log files</div>
        <div className="mb-4 last:mb-0 description">We, or rather AWS on our behalf, collect data on every access to our website on the basis of our legitimate interest. The access data includes the name of the website accessed, file, date and time of access, amount of data transferred, notification of successful access, browser type and version, the user&apos;s operating system, referrer URL (the previously visited page), IP address and the requesting provider. Log file information is stored for security reasons (e.g., for the clarification of abuse or fraud) for a maximum of 7 days and then deleted. Data whose further storage is necessary for evidentiary purposes is exempt from deletion until the respective incident is finally clarified.</div>
        <div className="mt-8 mb-2 caption-small text-primary-blue uppercase">c) Contacting us</div>
        <div className="mb-4 last:mb-0 description">If you contact us, we process the following data from you for the purpose of processing and handling your enquiry: Name, contact details -if provided by you- and your message. The legal basis of the data processing is our obligation to fulfil the contract and/or to fulfil our pre-contractual obligations in accordance and/or our legitimate interest in processing your enquiry.</div>
        <div className="mt-8 mb-2 caption-small text-primary-blue uppercase">d) Use of cookies</div>
        <div className="mb-4 last:mb-0 description">We think it&apos;s important that you have full control over your privacy online. That&apos;s why we refrained from placing cookies that are not strictly necessary as such no requirement to obtain consent exists. Please keep in mind that this approach may change and that our approach to cookies may be revised or that it becomes necessary to use a certain cookie to ensure the full functionality and security of our website.</div>
        <div className="mt-8 mb-2 caption-small text-primary-blue uppercase">e) Data management and customer support</div>
        <div className="mb-4 last:mb-0 description">For optimal customer support, we use first name, last name, e-mail address, and the data related to your contract with us. This data processing is based on our legitimate interest in providing our customer service.</div>
        <div className="mt-8 mb-2 caption-small text-primary-blue uppercase">f) Contract processing</div>
        <div className="mb-4 last:mb-0 description">We process your first name, last name, e-mail address, and the data related to your contract with us data to handle the contractual relationship between you and us. The legal basis for the data processing is the fulfillment of our contractual obligations and, in individual cases, the fulfillment of our legal obligations.</div>
        <div className="mt-8 mb-2 caption-small text-primary-blue uppercase">g) NFT Purchases</div>
        <div className="mb-4 last:mb-0 description">To make a purchase, you may need to connect a valid wallet account (<a className='underline' href='https://consensys.net/privacy-policy/'>MetaMask</a>, or <a className='underline' href='https://drive.google.com/file/d/1jrZAiwZp8p2WQX30wG3F42iCB3dkhRpn/view'>Crossmint[m1]</a>). We would like to point out that we are not responsible for any processing of personal data when connecting your crypto wallet.</div>

        <div className="mt-10 mb-4 caption uppercase">Storage and Deletion of Data</div>
        <div className="mb-4 last:mb-0 description">The data processed by us will be stored using the services of AWS and is deleted or its processing restricted in accordance with the requirements set out in the DPA and the GDPR. Unless expressly stated, the data stored by us will be deleted as soon as it is no longer required for its intended purpose and the deletion does not conflict with any statutory retention obligations. If the data is not deleted because it is required for other and legally permissible purposes, its processing will be restricted. I.e., the data is blocked and not processed for other purposes. This applies, for example, to data that must be retained for reasons of commercial or tax law.</div>

        <div className="mt-10 mb-4 caption uppercase">Transfer of Personal Data</div>
        <div className="mb-4 last:mb-0 description">We will not disclose or otherwise distribute your Personal Data to third parties unless this is necessary for the performance of our services, you have consented to the disclosure, or the disclosure of data is permitted by relevant legal provisions.</div>
        <div className="mb-4 last:mb-0 description">We are entitled to outsource the processing of your Personal Data in whole or in part to external service providers acting as processors for within the framework of the DPA and GDPR. External service providers support us, for example, in the technical operation and support of the website, data management, the provision and performance of services, marketing, as well as the implementation and fulfilment of reporting obligations.</div>
        <div className="mb-4 last:mb-0 description">The service providers commissioned by us process your data exclusively in accordance with our instructions. Nonetheless, we remain responsible for the protection of your data, which is ensured by strict contractual regulations, technical and organisational measures, and additional controls by us.</div>
        <div className="mb-4 last:mb-0 description">Personal data may also be disclosed to third parties if we are legally obliged to do so e.g., by court order or if this is necessary to support criminal or legal investigations or other legal investigations or proceedings at home or abroad or to fulfil our legitimate interests.</div>

        <div className="mt-10 mb-4 caption uppercase">Updating your information</div>
        <div className="mb-4 last:mb-0 description">If you believe that the information, we hold about you is inaccurate or that we are no longer entitled to use it and want to request its rectification, deletion, or object to its processing, please do so by contacting us. For your protection and the protection of all of our users, we may ask you to provide proof of identity before we can answer the above requests.</div>
        <div className="mb-4 last:mb-0 description">Keep in mind, we may reject requests for certain reasons, including if the request is unlawful or if it may infringe on trade secrets or intellectual property or the privacy of another user. Also, we may not be able to accommodate certain requests to object to the processing of Personal Data, notably where such requests would not allow us to provide our service to you anymore.</div>

        <div className="mt-10 mb-4 caption uppercase">Social Media</div>
        <div className="mb-4 last:mb-0 description">Based on our legitimate interest, we are present in various &ldquo;social media&ldquo; networks in order to communicate with our users, interested parties and users registered there and to be able to inform them about our offers there. We would like to point out that you use these platforms and their functions on your own responsibility. This applies in particular to the use of the interactive functions (e.g., commenting, sharing, rating).</div>

        <div className="mt-10 mb-4 caption uppercase">Controls For Do-Not-Track Features</div>
        <div className="mb-4 last:mb-0 description">Most web browsers and some mobile operating systems and mobile applications include a Do-Not-Track (“DNT”) feature or setting you can activate to signal your privacy preference not to have data about your online browsing activities monitored and collected. At this stage no uniform technology standard for recognising and implementing DNT signals has been finalised.</div>
        <div className="mb-4 last:mb-0 description">As such, we do not currently respond to DNT browser signals or any other mechanism that automatically communicates your choice not to be tracked online. If a standard for online tracking is adopted that we must follow in the future, we will inform you about that practice in a revised version of this privacy policy.</div>

        <div className="mt-10 mb-4 caption uppercase">Do Not Sell</div>
        <div className="mb-4 last:mb-0 description">We do not sell data to third parties. However, we might, making available, transfer, communicate electronically, consumer&quot;s personally identifiable information by the business to a business affiliated inclusive with a third party but not for monetary but for other valuable consideration.</div>

        <div className="mt-10 mb-4 caption uppercase">Children&quot;s Privacy</div>
        <div className="mb-4 last:mb-0 description">Our services are restricted to users who are 18 years of age or older. We do not knowingly collect Personal Data from anyone under the age of 18. If you suspect that a user is under the age of 18, please contact us.</div>

        <div className="mt-10 mb-4 caption uppercase">Changes</div>
        <div className="mb-4 last:mb-0 description">Because we&quot;re always lookiwng for new and innovative ways to improve our website and services, this policy may change over time. We will notify you before any material changes take effect so that you have time to review the changes.</div>

        <div className="mt-10 mb-4 caption uppercase">Who should I contact for more information?</div>
        <div className="mb-4 last:mb-0 description">If you have any questions or comments about our Privacy Policy or wish to exercise your rights under applicable laws, please contact us. This Privacy Policy was last updated on Tuesday, December 13, 2022</div>

        <div className="mt-20">
          <PassengersSocialButtons />
        </div>
      </ContentContainer>
    </div>
  );
}
