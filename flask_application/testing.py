from openai import OpenAI
import openai
openai_api_key = 'sk-proj-ezGDJ3kUIG4WoxTetAYJT3BlbkFJTcq7akmflWPN2XZ6LayS'

def chat_with_gpt(prompt):
    # response = openai.ChatCompletion.create(
    #     model = 'gpt-3.5-turbo',
    #     message = [{'role': 'user', 'text': prompt}]
    # )
    # return response.choices[0].message.content.strip()
    client = OpenAI(
        api_key = openai_api_key
    )
    # response = client.chat.completions.create(
    #     messages=[
    #         {'role' : 'user',
    #         'content' : prompt
    #          }],
    # model = 'gpt-3.5-turbo'
    # )
    openai.api_key = 'sk-proj-ezGDJ3kUIG4WoxTetAYJT3BlbkFJTcq7akmflWPN2XZ6LayS'
    response = openai.Completion.create(
        model='gpt-3.5-turbo',
        messages=[
            {'role': 'system', 'content': 'You are a helpful assistance.'},
            {'role': 'user', 'content': prompt}
        ]
    )
    return response.choices[0].message.content.strip()
if __name__ == '__main__':
    while True:
        user_input = input("you:")
        if user_input.lower() in ['bye','break','exit']:
            break
        response = chat_with_gpt(user_input)
        print('gpt: ' + response)



